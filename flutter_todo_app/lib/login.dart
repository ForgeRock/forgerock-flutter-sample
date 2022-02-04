import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter_todo_app/FRNode.dart';
import 'package:flutter_todo_app/todolist.dart';

import 'main.dart';


class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => new _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  static const platform = MethodChannel('forgerock.com/SampleBridge');
  List<TextField> _fields = [];
  List<TextEditingController> _controllers = [];
  late FRNode currentNode;

  @override
  void initState() {
    super.initState();
    SchedulerBinding.instance?.addPostFrameCallback((_) => {
      _startSDK()
    });
  }

  Future<void> _startSDK() async {
    String response;
    try {
      final String result = await platform.invokeMethod('frAuthStart');
      response = 'SDK Started';
      _login();
    } on PlatformException catch (e) {
      response = "SDK Start Failed: '${e.message}'.";
    }
    debugPrint('SDK: $response');
  }

  Future<void> _login() async {
    final String result = await platform.invokeMethod('login');
    Map<String, dynamic> frNodeMap = jsonDecode(result);
    var frNode = FRNode.fromJson(frNodeMap);
    currentNode = frNode;
    _handleNode(frNode);
    debugPrint('SDK: $result');
  }

  void _handleNode(FRNode frNode) {
    frNode.callbacks.forEach((frCallback) {
      debugPrint('SDK: $frCallback');
      final controller = TextEditingController();
      final field = TextField(
        controller: controller,
        obscureText: frCallback.type == "PasswordCallback",
        enableSuggestions: false,
        autocorrect: false,
        decoration: InputDecoration(
          border: OutlineInputBorder(),
          labelText: frCallback.output[0].value,
        ),
      );
      setState(() {
        _controllers.add(controller);
        _fields.add(field);
      });
    });
  }

  void _navigateToNextScreen(BuildContext context) {
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => TodoList()),);
  }

  Future<void> _next() async {
    currentNode.callbacks.asMap().forEach((index, frCallback) {
      _controllers.asMap().forEach((controllerIndex, controller) {
        if (controllerIndex == index) {
          frCallback.input[0].value = controller.text;
        }
      });
    });
    String jsonResponse = jsonEncode(currentNode);
    try {
      String result = await platform.invokeMethod('next', jsonResponse);
      Navigator.pop(context);
      Map<String, dynamic> response = jsonDecode(result);
      if (response["type"] == "LoginSuccess") {
        _navigateToNextScreen(context);
      } else  {
        Map<String, dynamic> frNodeMap = jsonDecode(result);
        var frNode = FRNode.fromJson(frNodeMap);
        currentNode = frNode;
        _handleNode(frNode);
      }
      debugPrint('SDK: $result');
    } catch (e) {
      debugPrint('SDK Error: $e');
    }
  }

  Widget _listView() {
    return ListView.builder(
      shrinkWrap: true,
      itemCount: _fields.length,
      itemBuilder: (context, index) {
        return Container(
          margin: EdgeInsets.all(15.0),
          child: _fields[index],
        );
      },
    );
  }

  Widget _okButton() {
    return Container(
      color: Colors.transparent,
      width: MediaQuery.of(context).size.width,
      margin: EdgeInsets.all(15.0),
      height: 60,
      child: TextButton(
        style: ButtonStyle(backgroundColor: MaterialStateProperty.all(Colors.blue)),
        onPressed: () async {
          showAlertDialog(context);
          _next();
        },
        child:
        Text(
          "Sign in",
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }

  void showAlertDialog(BuildContext context) {
    AlertDialog alert=AlertDialog(
      content: new Row(
        children: [
          CircularProgressIndicator(),
          Container(margin: EdgeInsets.only(left: 5),child:Text("Loading" )),
        ],),
    );
    showDialog(barrierDismissible: false,
      context:context,
      builder:(BuildContext context){
        return alert;
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("Sign-In", style: TextStyle(color: Colors.grey[800]),),
          backgroundColor: Colors.grey[200],
        ),
        backgroundColor: Colors.grey[100],
        body: Column(
          children: [
            _listView(),
            _okButton(),
          ],
        ));
  }
}