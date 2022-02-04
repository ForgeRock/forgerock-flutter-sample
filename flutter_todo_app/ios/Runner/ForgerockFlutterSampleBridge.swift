//
//  ForgerockFlutterSampleBridge.swift
//  Runner
//
//  Created by George Bafaloukas on 10/12/2021.
//

import Foundation
import FRAuth
import Flutter

public class ForgerockFlutterSampleBridge {
    var currentNode: Node?
    
    @objc func frAuthStart(result: @escaping FlutterResult) {
      // Set log level according to your needs
      FRLog.setLogLevel([.all])
      
      do {
        try FRAuth.start()
          result("SDK Initialised")
          FRUser.currentUser?.logout()
      }
      catch {
        FRLog.e(error.localizedDescription)
          result(FlutterError(code: "SDK Init Failed",
                              message: error.localizedDescription,
                              details: nil))
      }
    }
    
    @objc func loginWithoutUI(result: @escaping FlutterResult) {
        FRUser.login { (user, node, error) in
            self.handleNode(user, node, error, completion: result)
        }
    }
    
    @objc func frLogout(result: @escaping FlutterResult) {
        FRUser.currentUser?.logout()
        result("User logged out")
    }
    
    @objc func getUserInfo(result: @escaping FlutterResult) {
        FRUser.currentUser?.getUserInfo(completion: { userInfo, error in
            if (error != nil) {
                result(FlutterError(code: "Error",
                                        message: error?.localizedDescription,
                                    details: nil))
            } else {
                let encoder = JSONEncoder()
                encoder.outputFormatting = .prettyPrinted
                if let userInfo = userInfo?.userInfo, let userInfoJson = try? userInfo.toJson() {
                    result(userInfoJson)
                } else {
                    result(FlutterError(code: "Error",
                                            message: "User info encoding failed",
                                        details: nil))
                }
                
            }
        })
    }
    
    @objc func next(_ response: String, completion: @escaping FlutterResult) {
        let decoder = JSONDecoder()
        let jsonData = Data(response.utf8)
        if let node = self.currentNode {
          var responseObject: Response?
          do {
            responseObject = try decoder.decode(Response.self, from: jsonData)
          } catch  {
            print(String(describing: error))
              completion(FlutterError(code: "Error",
                                      message: error.localizedDescription,
                                  details: nil))
          }
          
          let callbacksArray = responseObject!.callbacks ?? []
          // If the array is empty there are no user inputs. This can happen in callbacks like the DeviceProfileCallback, that do not require user interaction.
          // Other callbacks like SingleValueCallback, will return the user inputs in an array of dictionaries [[String:String]] with the keys: identifier and text
          if callbacksArray.count == 0 {
            for nodeCallback in node.callbacks {
              if let thisCallback = nodeCallback as? DeviceProfileCallback {
                let semaphore = DispatchSemaphore(value: 1)
                semaphore.wait()
                thisCallback.execute { _ in
                  semaphore.signal()
                }
              }
            }
          } else {
            for (outerIndex, nodeCallback) in node.callbacks.enumerated() {
              if let thisCallback = nodeCallback as? KbaCreateCallback {
                for (innerIndex, rawCallback) in callbacksArray.enumerated() {
                  if let inputsArray = rawCallback.input, outerIndex == innerIndex {
                    for input in inputsArray {
                      if let value = input.value!.value as? String {
                        if input.name.contains("question") {
                          thisCallback.setQuestion(value)
                        } else {
                          thisCallback.setAnswer(value)
                        }
                      }
                    }
                  }
                }
              }
              if let thisCallback = nodeCallback as? SingleValueCallback {
                for (innerIndex, rawCallback) in callbacksArray.enumerated() {
                  if let inputsArray = rawCallback.input, outerIndex == innerIndex, let value = inputsArray.first?.value {
                    switch value.originalType {
                    case .String:
                      thisCallback.setValue(value.value as! String)
                    case .Int:
                      thisCallback.setValue(value.value as! Int)
                    case .Double:
                      thisCallback.setValue(value.value as! Double)
                    case .Bool:
                      thisCallback.setValue(value.value as! Bool)
                    default:
                      break
                    }
                  }
                }
              }
            }
          }
          
          //Call node.next
          node.next(completion: { (user: FRUser?, node, error) in
            if let node = node {
              //Handle node and return
              self.handleNode(user, node, error, completion: completion)
            } else {
              if let error = error {
                //Send the error back in the rejecter - nextStep.type === 'LoginFailure'
                  completion(FlutterError(code: "LoginFailure",
                                          message: error.localizedDescription,
                                      details: nil))
                return
              }
              //Transform the response for the nextStep.type === 'LoginSuccess'
              let encoder = JSONEncoder()
              encoder.outputFormatting = .prettyPrinted
                do {
                    if let user = user, let token = user.token, let data = try? encoder.encode(token), let jsonAccessToken = String(data: data, encoding: .utf8) {
                        completion(try ["type": "LoginSuccess", "sessionToken": jsonAccessToken].toJson())
                    } else {
                        completion(try ["type": "LoginSuccess", "sessionToken": ""].toJson())
                    }
                }
                catch {
                    completion(FlutterError(code: "Serializing Response failed",
                                        message: error.localizedDescription,
                                        details: nil))
                }
            }
          })
          
        } else {
            completion(FlutterError(code: "Error",
                                message: "UnkownError",
                                details: nil))
        }
    }
    
    private func handleNode(_ result: Any?, _ node: Node?, _ error: Error?, completion: @escaping FlutterResult) {
        if let node = node {
          self.currentNode = node
          let frNode = FRNode(node: node)
          do {
              completion(try frNode.resolve())
          }
          catch {
              completion(FlutterError(code: "Serializing Node failed",
                                  message: error.localizedDescription,
                                  details: nil))
          }
        } else {
            completion(FlutterError(code: "Error",
                                message: "No node present",
                                details: nil))
        }
    }
}

public struct FRNode: Encodable {
  
  var frCallbacks: [FRCallback]
  
  var authId: String
  /// Unique UUID String value of initiated AuthService flow
  var authServiceId: String
  /// Stage attribute in Page Node
  var stage: String?
  /// Header attribute in Page Node
  var pageHeader: String?
  /// Description attribute in Page Node
  var pageDescription: String?
  //array of raw callbacks
  var callbacks: [[String: Any]]
  
  private enum CodingKeys: String, CodingKey {
      case frCallbacks, authId, authServiceId, stage, pageHeader, pageDescription
  }
  
  init(node: Node) {
    authId = node.authId
    authServiceId = node.authServiceId
    stage = node.stage
    pageHeader = node.pageHeader
    pageDescription = node.pageDescription
    frCallbacks = [FRCallback]()
    callbacks = [[String: Any]]()
    for callback in node.callbacks {
      callbacks.append(callback.response)
      frCallbacks.append(FRCallback(callback: callback))
    }
  }
  
  //used for passing the Node object back to the Flutter layer
  func resolve() throws -> String  {
    var response = [String: Any]()
    response["authId"] = self.authId
    response["authServiceId"] = self.authServiceId
    response["stage"] = self.stage
    response["description"] = self.pageDescription
    response["header"] = self.pageHeader
    response["callbacks"] = self.callbacks
    return try response.toJson()
  }
}

public struct FRCallback: Encodable {
  var type: String
  var prompt: String?
  var choices: [String]?
  var predefinedQuestions: [String]?
  var inputNames: [String]?
  var policies: RawPolicies?
  var failedPolicies: [RawFailedPolicies]?
  
  /// Raw JSON response of Callback
  var response: String
  
  init(callback: Callback) {
    self.type = callback.type
    
    if let thisCallback = callback as? SingleValueCallback {
      self.prompt = thisCallback.prompt
      self.inputNames = [thisCallback.inputName!]
    }
    
    if let thisCallback = callback as? KbaCreateCallback {
      self.prompt = thisCallback.prompt
      self.predefinedQuestions = thisCallback.predefinedQuestions
      self.inputNames = thisCallback.inputNames
    }
    
    if let thisCallback = callback as? ChoiceCallback {
      self.choices = thisCallback.choices
      self.inputNames = [thisCallback.inputName!]
    }
    
    if let thisCallback = callback as? AbstractValidatedCallback {
      if let policyDictionary = thisCallback.policies, let policiesJSON = try? policyDictionary.toJson() {
        let jsonData = Data(policiesJSON.utf8)
        do {
          self.policies = try JSONDecoder().decode(RawPolicies.self, from: jsonData)
        }
        catch {
          print(error)
        }
      }
      if let failedPolicies = thisCallback.failedPolicies {
        self.failedPolicies = []
        for failedPolicy in failedPolicies {
          var paramsDictionary = [String: FlexibleType]()
          if let params = failedPolicy.params {
            let newDictionary = params.mapValues { value -> FlexibleType in
              if let str = value as? String {
                return FlexibleType(str, originalType: .String)
              } else if let str = value as? Int {
                return FlexibleType(String(str), originalType: .Int)
              } else if let str = value as? Double {
                return FlexibleType(String(str), originalType: .Double)
              } else if let str = value as? Bool {
                return FlexibleType(String(str), originalType: .Bool)
              } else {
                return FlexibleType("", originalType: .String)
              }
            }
            paramsDictionary = newDictionary
          }
          self.failedPolicies?.append(RawFailedPolicies(propertyName: self.prompt, params: paramsDictionary, policyRequirement:  failedPolicy.policyRequirement, failedDescription: failedPolicy.failedDescription()))
        }
      }
    }
    
    if let jsonData = try? JSONSerialization.data(withJSONObject: callback.response, options: .prettyPrinted), let jsonString = String(data: jsonData, encoding: .utf8) {
      self.response = jsonString
    } else {
      self.response = ""
    }
  }
}

public struct Response: Codable {
  var authId: String?
  var callbacks: [RawCallback]?
  var status: Int?
}

public struct RawCallback: Codable {
  var type: String?
  var input: [RawInput]?
  var _id: Int?
}

public struct RawPolicies: Codable {
  var name: String?
  var policyRequirements: [String]?
  var policies: [Policy]?
}

public struct RawFailedPolicies: Codable {
  var propertyName: String?
  var params: [String: FlexibleType]?
  var policyRequirement: String?
  var failedDescription: String?
}

public struct Policy: Codable {
  var policyId: String?
  var policyRequirements: [String]?
  var params: [String: FlexibleType]?
}

public struct RawInput: Codable {
  var name: String
  var value: FlexibleType?
}

public enum ResponseType {
  case String
  case Int
  case Double
  case Bool
  case TypeMismatch
  case NotSet
}

public struct FlexibleType: Codable {
  let value: Any
  let originalType: ResponseType
  
  init(_ value: String, originalType: ResponseType = .NotSet) {
    self.value = value
    self.originalType = originalType
  }
  
  public init(from decoder: Decoder) throws {
    let container = try decoder.singleValueContainer()
    // attempt to decode from all JSON primitives
    if let str = try? container.decode(String.self) {
      value = str
      originalType = .String
    } else if let int = try? container.decode(Int.self) {
      value = int
      originalType = .Int
    } else if let double = try? container.decode(Double.self) {
      value = double
      originalType = .Double
    } else if let bool = try? container.decode(Bool.self) {
      value = bool
      originalType = .Bool
    } else {
      originalType = .String
      value = ""
    }
  }
  
  public func encode(to encoder: Encoder) throws {
    var container = encoder.singleValueContainer()
    switch originalType {
    case .String:
      try container.encode(value as! String)
    case .Int:
      let unwarpedValue = value as? Int ?? Int(value as! String)
      try container.encode(unwarpedValue)
    case .Double:
      let unwarpedValue = value as? Double ?? Double(value as! String)
      try container.encode(unwarpedValue)
    case .Bool:
      let unwarpedValue = value as? Bool ?? Bool(value as! String)
      try container.encode(unwarpedValue)
    default:
      try container.encode("")
    }
    
  }
}

fileprivate extension Dictionary {
    
    /// Convert Dictionary to JSON string
    /// - Throws: exception if dictionary cannot be converted to JSON data or when data cannot be converted to UTF8 string
    /// - Returns: JSON string
    func toJson() throws -> String {
        let data = try JSONSerialization.data(withJSONObject: self)
        if let string = String(data: data, encoding: .utf8) {
            return string
        }
        throw NSError(domain: "Dictionary", code: 1, userInfo: ["message": "Data cannot be converted to .utf8 string"])
    }
}

fileprivate extension Array {
  
  /// Convert Array to JSON string
  /// - Throws: exception if Array cannot be converted to JSON data or when data cannot be converted to UTF8 string
  /// - Returns: JSON string
  func toJson() throws -> String {
      let data = try JSONSerialization.data(withJSONObject: self, options: [])
      return String(data: data, encoding: .utf8)!
  }
}

extension ForgerockFlutterSampleBridge {
    func setUpChannels(_ window: UIWindow?) {
        let controller : FlutterViewController = window?.rootViewController as! FlutterViewController
        let bridgeChannel = FlutterMethodChannel(name: "forgerock.com/SampleBridge",
                                                 binaryMessenger: controller.binaryMessenger)
        
        
        bridgeChannel.setMethodCallHandler({
            (call: FlutterMethodCall, result: @escaping FlutterResult) -> Void in
            switch call.method {
            case "frAuthStart":
                self.frAuthStart(result: result)
            case "login":
                self.loginWithoutUI(result: result)
            case "logout":
                self.frLogout(result: result)
            case "next":
                if let response = call.arguments as? String {
                    self.next(response, completion: result)
                } else {
                    result(FlutterError(code: "500", message: "Arguments not parsed correctly", details: nil))
                }
            case "getUserInfo":
                self.getUserInfo(result: result)
            default:
                result(FlutterMethodNotImplemented)
            }
        })
    }
}
