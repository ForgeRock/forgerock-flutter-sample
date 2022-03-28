import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_todo_app/FRNode.dart';
import 'package:flutter_todo_app/todolist.dart';


class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => new _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  static const platform = MethodChannel('forgerock.com/SampleBridge'); //Method channel as defined in the native Bridge code
  List<TextField> _fields = [];
  List<TextEditingController> _controllers = [];
  late FRNode currentNode;

  //Lifecycle Methods


  // SDK Calls -  Note the promise type responses. Handle errors on the UI layer as required
  Future<void> _startSDK() async {
    // Call the Native startSDK method using the MethodChannel
  }

  Future<void> _login() async {
    // Call the Native login method using the MethodChannel
  }

  Future<void> _next() async {
    // Capture the User Inputs from the UI, populate the currentNode callbacks and submit back to AM

  }

  // Handling methods
  void _handleNode(FRNode frNode) {

  }

  void _navigateToNextScreen(BuildContext context) {
    Navigator.push(context, MaterialPageRoute(builder: (context) => TodoList()),);
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

  // Widgets
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
          //Call Next
        },
        child:
        Text(
          "Sign in",
          style: TextStyle(color: Colors.white),
        ),
      ),
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