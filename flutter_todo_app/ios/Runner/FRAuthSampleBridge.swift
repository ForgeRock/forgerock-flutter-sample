/*
 * Copyright (c) 2022 ForgeRock. All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import Foundation
import FRAuth
import FRCore
import Flutter

public class FRAuthSampleBridge {
    var currentNode: Node?
    private let session = URLSession(configuration: .default)
    
    @objc func frAuthStart(result: @escaping FlutterResult) {
        //Add SDK Start code here
        /**
         * Set log level to all
         */
        FRLog.setLogLevel([.all])
        
        do {
            try FRAuth.start()
            let initMessage = "SDK is initialized"
            FRLog.i(initMessage)
            
            // For allowing the user to re-login
            FRUser.currentUser?.logout()
            result(initMessage)
        } catch {
            FRLog.e(error.localizedDescription)
            result(FlutterError(code: "SDK Init Failed",
                                message: error.localizedDescription,
                                details: nil))
        }
    }
    
    @objc func login(result: @escaping FlutterResult) {
        //Add SDK Login code here
        FRUser.login { (user, node, error) in
            self.handleNode(user, node, error, completion: result)
        }
    }
    
    @objc func frLogout(result: @escaping FlutterResult) {
        //Add SDK Logout code here
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
        // Add "Next Step" logic here
        let decoder = JSONDecoder()
        let jsonData = Data(response.utf8)
        if let node = self.currentNode {
            var responseObject: Response?
            do {
                responseObject = try decoder.decode(Response.self, from: jsonData)
            } catch  {
                FRLog.e(String(describing: error))
                completion(FlutterError(code: "Error",
                                        message: error.localizedDescription,
                                        details: nil))
            }
            
            let callbacksArray = responseObject!.callbacks ?? []
            
            for (outerIndex, nodeCallback) in node.callbacks.enumerated() {
                if let thisCallback = nodeCallback as? SingleValueCallback {
                    for (innerIndex, rawCallback) in callbacksArray.enumerated() {
                        if let inputsArray = rawCallback.input, outerIndex == innerIndex,
                           let value = inputsArray.first?.value {
                            
                            thisCallback.setValue(value.value)
                        }
                    }
                }
            }
            node.next(completion: { (user: FRUser?, node, error) in
                if let node = node {
                    self.handleNode(user, node, error, completion: completion)
                } else {
                    if let error = error {
                        completion(FlutterError(code: "LoginFailure",
                                                message: error.localizedDescription,
                                                details: nil))
                        return
                    }
                    
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
    
    @objc func callEndpoint(_ endpoint: String, method: String, payload: String, completion: @escaping FlutterResult) {
        // Invoke API
        FRUser.currentUser?.getAccessToken { (user, error) in
            
            //  AM 6.5.2 - 7.0.0
            //
            //  Endpoint: /oauth2/realms/userinfo
            //  API Version: resource=2.1,protocol=1.0
            
            var header: [String: String] = [:]
            
            if error == nil, let user = user {
                header["Authorization"] = user.buildAuthHeader()
            }
            
            let request = Request(url: endpoint, method: Request.HTTPMethod(rawValue: method) ?? .GET, headers: header, bodyParams: payload.convertToDictionary() ?? [:], urlParams: [:], requestType: .json, responseType: .json)
            self.session.dataTask(with: request.build()!) { (data, response, error) in
                guard let responseData = data, let httpResponse = response as? HTTPURLResponse, error == nil else {
                    completion(FlutterError(code: "API Error",
                                            message: error?.localizedDescription,
                                            details: nil))
                    return
                }
                
                if (200 ..< 303) ~= httpResponse.statusCode {
                    completion(String(data: responseData, encoding: .utf8))
                } else {
                    completion(FlutterError(code: "Error: statusCode",
                                            message: httpResponse.statusCode.description,
                                            details: nil))
                }
            }.resume()
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

extension FRAuthSampleBridge {
    func setUpChannels(_ window: UIWindow?) {
        guard let controller = window?.rootViewController as? FlutterViewController else {
            print("Could not resolve FlutterViewController from window?.rootViewController")
            return
        }
        let bridgeChannel = FlutterMethodChannel(name: "forgerock.com/SampleBridge",
                                                 binaryMessenger: controller.binaryMessenger)
        
        
        bridgeChannel.setMethodCallHandler({
            (call: FlutterMethodCall, result: @escaping FlutterResult) -> Void in
            switch call.method {
            case "frAuthStart":
                self.frAuthStart(result: result)
            case "login":
                self.login(result: result)
            case "register":
                //Call native Register function
                break
            case "logout":
                self.frLogout(result: result)
            case "next":
                if let response = call.arguments as? String {
                    self.next(response, completion: result)
                } else {
                    result(FlutterError(code: "500", message: "Arguments not parsed correctly", details: nil))
                }
            case "callEndpoint":
                if let arguments = call.arguments as? [String] {
                    self.callEndpoint(arguments[0], method: arguments[1], payload: arguments[2], completion: result)
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
