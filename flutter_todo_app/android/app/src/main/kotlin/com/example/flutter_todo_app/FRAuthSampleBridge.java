package com.example.flutter_todo_app;/*
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import android.content.Context;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import org.forgerock.android.auth.AccessToken;
import org.forgerock.android.auth.Config;
import org.forgerock.android.auth.FRAuth;
import org.forgerock.android.auth.FRListener;
import org.forgerock.android.auth.FRUser;
import org.forgerock.android.auth.Logger;
import org.forgerock.android.auth.Node;
import org.forgerock.android.auth.NodeListener;
import org.forgerock.android.auth.PolicyAdvice;
import org.forgerock.android.auth.SecureCookieJar;
import org.forgerock.android.auth.UserInfo;
import org.forgerock.android.auth.callback.AbstractPromptCallback;
import org.forgerock.android.auth.callback.BooleanAttributeInputCallback;
import org.forgerock.android.auth.callback.Callback;
import org.forgerock.android.auth.callback.ChoiceCallback;
import org.forgerock.android.auth.callback.DeviceProfileCallback;
import org.forgerock.android.auth.callback.KbaCreateCallback;
import org.forgerock.android.auth.callback.NameCallback;
import org.forgerock.android.auth.callback.PasswordCallback;
import org.forgerock.android.auth.callback.StringAttributeInputCallback;
import org.forgerock.android.auth.callback.TermsAndConditionsCallback;
import org.forgerock.android.auth.callback.ValidatedPasswordCallback;
import org.forgerock.android.auth.callback.ValidatedUsernameCallback;
import org.forgerock.android.auth.exception.AuthenticationRequiredException;
import org.forgerock.android.auth.interceptor.AccessTokenInterceptor;
import org.forgerock.android.auth.interceptor.AdviceHandler;
import org.forgerock.android.auth.interceptor.IdentityGatewayAdviceInterceptor;
import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Semaphore;

import io.flutter.plugin.common.MethodChannel;
import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.logging.HttpLoggingInterceptor;

public class FRAuthSampleBridge {
    Context context;
    Node currentNode;
    NodeListener listener;
    MethodChannel.Result flutterPromise;

    FRAuthSampleBridge(Context context) {
        this.context = context;
    }

    private static final String CHANNEL = "forgerock.com/SampleBridge";

    public void start(MethodChannel.Result promise) {
        Logger.set(Logger.Level.DEBUG);
        FRAuth.start(this.context);
        Config
        promise.success("SDK Initialized");
        // Clear the session - for debug reasons
        FRUser user = FRUser.getCurrentUser();
        if (user != null) {
            user.logout();
        }
    }

    public void logout(MethodChannel.Result promise) {
        FRUser user = FRUser.getCurrentUser();
        if (user != null) {
            user.logout();
            promise.success("User logged out");
        }
    }

    public void login(MethodChannel.Result promise) {
        try{
            authenticate(promise, true);
        }catch (Exception e){
            promise.error("error", e.toString(), e);
        }
    }

    public void register(MethodChannel.Result promise) {
        try{
            authenticate(promise, false);
        }catch (Exception e){
            promise.error("error", e.toString(), e);
        }
    }

    public void getAccessToken(MethodChannel.Result promise) {
        this.flutterPromise = promise;
        if (FRUser.getCurrentUser() != null) {
            FRUser.getCurrentUser().getAccessToken(new FRListener<AccessToken>() {
                @Override
                public void onSuccess(AccessToken result) {
                    Gson gson = new Gson();
                    String accessTokenJson = gson.toJson(result);
                    flutterPromise.success(accessTokenJson);
                }

                @Override
                public void onException(Exception e) {
                    flutterPromise.error("error", e.getMessage(), e);
                }
            });
        } else {
            Logger.error("error", "Current user is null. Not logged in or SDK not initialized yet");
            this.flutterPromise.error("error", "Current user is null. Not logged in or SDK not initialized yet", null);
        }
    }

    public void getUserInfo(MethodChannel.Result promise) {
        if (FRUser.getCurrentUser() != null) {
            FRUser.getCurrentUser().getUserInfo(new FRListener<UserInfo>() {
                @Override
                public void onSuccess(final UserInfo result) {
                    JSONObject jsonResult = result.getRaw();
                    promise.success(jsonResult.toString());
                }

                @Override
                public void onException(final Exception e) {
                    Logger.error("error", e, "getUserInfo Failed");
                    promise.error("error", e.getMessage(), e);
                }
            });
        } else {
            Logger.error("error", "Current user is null. Not logged in or SDK not initialized yet");
            promise.error("error", "Current user is null. Not logged in or SDK not initialized yet", null);
        }
    }

    public void callEndpoint(String endpoint, String method, String payload, MethodChannel.Result promise) {
        OkHttpClient.Builder builder = new OkHttpClient.Builder()
                .followRedirects(false);

        builder.addInterceptor(new AccessTokenInterceptor());
        builder.cookieJar(SecureCookieJar.builder()
                .context(this.context)
                .build());

        OkHttpClient client = builder.build();
        MediaType JSON = MediaType.parse("application/json; charset=utf-8");
        Request request;
        if (payload.length() > 0 ) {
            RequestBody body = RequestBody.create(payload, JSON);
            request = new Request.Builder().url(endpoint)
                    .method(method, body)
                    .build();
        } else {
            request = new Request.Builder().url(endpoint)
                    .method(method, null)
                    .build();
        }


        client.newCall(request).enqueue(new okhttp3.Callback() {
            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {
                promise.error("error", "Request Failed", e);
            }

            @Override
            public void onResponse(@NotNull Call call, @NotNull okhttp3.Response response) throws IOException {
                promise.success(response.body().string());
            }
        });
    }

    public void next(String response, MethodChannel.Result promise) throws InterruptedException {
        this.flutterPromise = promise;
        Gson gson= new Gson();
        Response responseObj = gson.fromJson(response,Response.class);
        if (responseObj != null) {
            List<Callback> callbacksList = currentNode.getCallbacks();
            for(int i = 0; i < callbacksList.size(); i++) {
                Object nodeCallback = callbacksList.get(i);

                for(int j = 0; j < responseObj.callbacks.size(); j++) {
                    RawCallback callback = responseObj.callbacks.get(j);
                    String currentCallbackType = callback.type;
                    RawInput input = callback.input.get(0);
                    if ((currentCallbackType.equals("NameCallback")) && i==j) {
                        currentNode.getCallback(NameCallback.class).setName((String) input.value);
                    }
                    if ((currentCallbackType.equals("ValidatedCreateUsernameCallback")) && i==j) {
                        currentNode.getCallback(ValidatedUsernameCallback.class).setUsername((String) input.value);
                    }
                    if ((currentCallbackType.equals("ValidatedCreatePasswordCallback")) && i==j) {
                        String password = (String) input.value;
                        currentNode.getCallback(ValidatedPasswordCallback.class).setPassword(password.toCharArray());
                    }
                    if ((currentCallbackType.equals("PasswordCallback")) && i==j) {
                        String password = (String) input.value;
                        currentNode.getCallback(PasswordCallback.class).setPassword(password.toCharArray());
                    }
                    if ((currentCallbackType.equals("ChoiceCallback")) && i==j) {
                        currentNode.getCallback(ChoiceCallback.class).setSelectedIndex((Integer) input.value);
                    }
                    if ((currentCallbackType.equals("KbaCreateCallback")) && i==j) {
                        for (RawInput rawInput : callback.input) {
                            if (rawInput.name.contains("question")) {
                                currentNode.getCallback(KbaCreateCallback.class).setSelectedQuestion((String) rawInput.value);
                            } else {
                                currentNode.getCallback(KbaCreateCallback.class).setSelectedAnswer((String) rawInput.value);
                            }
                        }
                    }
                    if ((currentCallbackType.equals("StringAttributeInputCallback")) && i==j) {
                        StringAttributeInputCallback stringAttributeInputCallback = (StringAttributeInputCallback) nodeCallback;
                        stringAttributeInputCallback.setValue((String) input.value);
                    }
                    if ((currentCallbackType.equals("BooleanAttributeInputCallback")) && i==j) {
                        BooleanAttributeInputCallback boolAttributeInputCallback = (BooleanAttributeInputCallback) nodeCallback;
                        boolAttributeInputCallback.setValue((Boolean) input.value);
                    }
                    if ((currentCallbackType.equals("TermsAndConditionsCallback")) && i==j) {
                        TermsAndConditionsCallback tcAttributeInputCallback = (TermsAndConditionsCallback) nodeCallback;
                        tcAttributeInputCallback.setAccept((Boolean) input.value);
                    }
                    if (currentCallbackType.equals("DeviceProfileCallback") && i==j) {
                        final Semaphore available = new Semaphore(1, true);
                        available.acquire();
                        currentNode.getCallback(DeviceProfileCallback.class).execute(context, new FRListener<Void>() {
                            @Override
                            public void onSuccess(Void result) {
                                Logger.warn("DeviceProfileCallback", "Device Profile Collection Succeeded");
                                available.release();
                            }

                            @Override
                            public void onException(Exception e) {
                                Logger.warn("DeviceProfileCallback", e, "Device Profile Collection Failed");
                                available.release();
                            }
                        });
                    }
                }
            }
        } else {
            promise.error("error", "parsing response failed", null);
        }

        currentNode.next(this.context, listener);
    }

    public void authenticate(MethodChannel.Result promise, boolean isLogin) {
        this.flutterPromise = promise;
        NodeListener<FRUser> nodeListenerFuture = new NodeListener<FRUser>() {
            @Override
            public void onSuccess(FRUser user) {
                final AccessToken accessToken;
                HashMap map = new HashMap<>();
                try {
                    accessToken = FRUser.getCurrentUser().getAccessToken();
                    Gson gson = new Gson();
                    String accessTokenJson = gson.toJson(accessToken);
                    map.put("type", "LoginSuccess");
                    map.put("sessionToken", accessTokenJson);
                    flutterPromise.success(gson.toJson(map));
                } catch (AuthenticationRequiredException e) {
                    Logger.warn("customLogin", e, "Login Failed");
                    flutterPromise.error("error", e.getLocalizedMessage(), e);
                }
            }

            @Override
            public void onException(Exception e) {
                // Handle Exception
                Logger.warn("customLogin", e, "Login Failed");
                flutterPromise.error("error", e.getLocalizedMessage(), e);
            }

            @Override
            public void onCallbackReceived(Node node) {
                listener = this;
                currentNode = node;
                FRNode frNode = new FRNode(node);
                Gson gson = new Gson();
                String json = gson.toJson(frNode);
                flutterPromise.success(json);
            }
        };

        if (isLogin == true) {
            FRUser.login(this.context, nodeListenerFuture);
        } else {
            FRUser.register(this.context, nodeListenerFuture);
        }
    }
}

class FRNode {
    List<FRCallback> frCallbacks;

    private String authId;
    /// Unique UUID String value of initiated AuthService flow
    private String authServiceId;
    /// Stage attribute in Page Node
    private String stage;
    /// Header attribute in Page Node
    private String pageHeader;
    /// Description attribute in Page Node
    private String pageDescription;
    //array of raw callbacks
    private List<JsonObject> callbacks;

    public FRNode(Node node) {
        this.authId = node.getAuthId();
        this.authServiceId = node.getAuthServiceId();
        this.stage = node.getStage();
        this.pageHeader = node.getHeader();
        this.pageDescription = node.getDescription();
        this.frCallbacks = new ArrayList<FRCallback>();
        this.callbacks = new ArrayList<JsonObject>();
        for (org.forgerock.android.auth.callback.Callback callback: node.getCallbacks()) {
            this.frCallbacks.add(new FRCallback(callback));
            JsonObject convertedObject = new Gson().fromJson(callback.getContent(), JsonObject.class);
            this.callbacks.add(convertedObject);
        }
    }

    public List<JsonObject> getCallbacks() { return callbacks; }

    public void setCallbacks(List<JsonObject> callbacks) { this.callbacks = callbacks; }

    public List<FRCallback> getFrCallbacks() {
        return frCallbacks;
    }

    public void setFrCallbacks(List<FRCallback> callbacks) {
        this.frCallbacks = callbacks;
    }

    public String getAuthId() {
        return authId;
    }

    public void setAuthId(String authId) {
        this.authId = authId;
    }

    public String getAuthServiceId() {
        return authServiceId;
    }

    public void setAuthServiceId(String authServiceId) {
        this.authServiceId = authServiceId;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getPageHeader() {
        return pageHeader;
    }

    public void setPageHeader(String pageHeader) {
        this.pageHeader = pageHeader;
    }

    public String getPageDescription() {
        return pageDescription;
    }

    public void setPageDescription(String pageDescription) {
        this.pageDescription = pageDescription;
    }

}

class FRCallback {
    private String type;
    private String prompt;
    private List<String> choices;
    private List<String> predefinedQuestions;
    private List<String> inputNames;

    /// Raw JSON response of Callback
    private String response;

    public FRCallback(org.forgerock.android.auth.callback.Callback callback) {
        this.type = callback.getType();
        this.inputNames = new ArrayList<String>();

        if (callback instanceof AbstractPromptCallback) {
            AbstractPromptCallback abstractPromptCallback = (AbstractPromptCallback) callback;
            this.prompt = abstractPromptCallback.prompt;
        }

        if (callback instanceof KbaCreateCallback) {
            KbaCreateCallback kbaCreateCallback = (KbaCreateCallback) callback;
            this.prompt = kbaCreateCallback.getPrompt();
            this.predefinedQuestions = kbaCreateCallback.getPredefinedQuestions();
        }

        if (callback instanceof ChoiceCallback) {
            ChoiceCallback choiceCallback = (ChoiceCallback) callback;
            this.prompt = choiceCallback.getPrompt();
            this.choices = choiceCallback.getChoices();
        }

        this.response = callback.getContent();
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public List<String> getChoices() {
        return choices;
    }

    public void setChoices(List<String> choices) {
        this.choices = choices;
    }

    public List<String> getPredefinedQuestions() {
        return predefinedQuestions;
    }

    public void setPredefinedQuestions(List<String> predefinedQuestions) {
        this.predefinedQuestions = predefinedQuestions;
    }

    public List<String> getInputNames() {
        return inputNames;
    }

    public void setInputNames(List<String> inputNames) {
        this.inputNames = inputNames;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
}

class Response {
    String authId;
    List<RawCallback> callbacks;
    Integer status;
}

class RawCallback {
    String type;
    List<RawInput> input;
    Integer _id;
}

class RawInput {
    String name;
    Object value;
}