//
//  FRAuthSampleStructs.swift
//  Runner
//
//  Created by George Bafaloukas on 03/03/2022.
//

import Foundation
import FRCore
import FRAuth

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
