import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';

class Todo {
  Todo({required this.name, required this.id, required this.checked});
  final String name;
  final String id;
  bool checked;
}

class TodoList extends StatefulWidget {
  @override
  _TodoListState createState() => new _TodoListState();
}

class TodoItem extends StatelessWidget {
  TodoItem({
    required this.todo,
    required this.onTodoChanged,
  }) : super(key: ObjectKey(todo));

  final Todo todo;
  final onTodoChanged;

  TextStyle? _getTextStyle(bool checked) {
    if (!checked) return null;

    return TextStyle(
      color: Colors.black54,
      decoration: TextDecoration.lineThrough,
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: () {
        onTodoChanged(todo);
      },
      leading: CircleAvatar(
        child: Text(todo.name[0]),
      ),
      title: Text(todo.name, style: _getTextStyle(todo.checked)),
    );
  }
}

class _TodoListState extends State<TodoList> {
  final TextEditingController _textFieldController = TextEditingController();
  final List<Todo> _todos = <Todo>[];
  final List<Widget> _widgets = <Widget>[];
  static const platform = MethodChannel('forgerock.com/SampleBridge');
  String header = "";
  String subtitle = "";

  //Lifecycle methods
  @override
  void initState() {
    super.initState();
    SchedulerBinding.instance?.addPostFrameCallback((_) => {
      //Calling the userinfo endpoint is going to give use some user profile information to enrich our UI. Additionally, verifies that we have a valid access token.
      _getUserInfo()
    });
  }

  // SDK Calls -  Note the promise type responses. Handle errors on the UI layer as required
  Future<void> _getUserInfo() async {
    showAlertDialog(context);
    String response;
    // Add call and logic for getting the UserInfo, by using the native bridge code via the MethodChannels
    try {
      final String result = await platform.invokeMethod('getUserInfo');
      Map<String, dynamic> userInfoMap = jsonDecode(result);
      response = result;
      header = userInfoMap["name"];
      subtitle = userInfoMap["email"];
      Navigator.pop(context);
      setState(() {
        _getTodos();
      });
    } on PlatformException catch (e) {
      response = "SDK Start Failed: '${e.message}'.";
      Navigator.pop(context);
    }
    debugPrint('SDK: $response');
  }

  Future<void> _logout() async {
    // Call logout, by using the native bridge code via the MethodChannels
    final String result = await platform.invokeMethod('logout');
    _navigateToNextScreen(context);
  }

  //Network Calls
  Future<void> _deleteTodo(Todo todo) async {
    try {
      String _id = todo.id;
      final String result = await platform.invokeMethod('callEndpoint', ["https://fr-todos-api.crbrl.io/todos/$_id",'DELETE', '']);
      _getTodos();
    } on PlatformException catch (e) {
      debugPrint('SDK: $e');
    }
  }

  Future<void> _updateTodo(Todo todo, bool checked) async {
    try {
      String _id = todo.id.toString();
      final String result = await platform.invokeMethod('callEndpoint', ["https://fr-todos-api.crbrl.io/todos/$_id",'POST', '{\"completed\": $checked}']);
      _getTodos();
    } on PlatformException catch (e) {
      debugPrint('SDK: $e');
    }
  }

  Future<void> _getTodos() async {
    try {
      final String result = await platform.invokeMethod('callEndpoint', ["https://fr-todos-api.crbrl.io/todos",'GET', '']);
      List<dynamic> toDosList = jsonDecode(result);
      List<Map<String, dynamic>> todos = List<Map<String, dynamic>>.from(toDosList);
      _todos.clear();
      todos.forEach((Map<String, dynamic> todoMap) {
        _todos.add(Todo(name: todoMap["title"], checked: todoMap["completed"], id: todoMap["_id"]));
        setState(() { });
      });
      debugPrint('SDK: $todos');
    } on PlatformException catch (e) {
      debugPrint('SDK: $e');
    }
  }

  Future<void> _addTodoItem(String name) async {
    try {
      final String result = await platform.invokeMethod('callEndpoint', ["https://fr-todos-api.crbrl.io/todos",'POST', '{\"title\": \"$name\"}']);
      _getTodos();
    } on PlatformException catch (e) {
      debugPrint('SDK: $e');
    }
    _textFieldController.clear();
  }

  //Helper funtions
  void _goHome() {
    Navigator.pop(context);
  }

  void _navigateToNextScreen(BuildContext context) {
    _goHome();
  }

  void _onItemTapped(int index) {
    if (index == 1) {
      _logoutDialog();
    }
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

  void _handleTodoChange(Todo todo) {
    setState(() {
      todo.checked = !todo.checked;
      _updateTodo(todo, todo.checked);
    });
  }

  //Widgets

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text(
          'Todo list',
          style: TextStyle(color: Colors.grey[800]),
        ),
        backgroundColor: Colors.grey[200],
      ),
      bottomNavigationBar: _bottomBar(),
      backgroundColor: Colors.grey[100],
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [_welcomeText(), _listView()],
      ),
      floatingActionButton: FloatingActionButton(
          onPressed: () => _displayDialog(),
          tooltip: 'Add Item',
          child: Icon(Icons.add)),
    );
  }

  Future<void> _logoutDialog() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Do you want to Log out?'),
          actions: <Widget>[
            TextButton(
              child: const Text('Yes'),
              onPressed: () {
                // Pop and call logout
                Navigator.of(context).pop();
                _logout();
              },
            ),
            TextButton(
              child: const Text('No'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  Widget _welcomeText() {
    return Container(
        color: Colors.greenAccent[100],
        width: MediaQuery.of(context).size.width,
        margin: EdgeInsets.all(15.0),
        child:
        Padding(
          padding: const EdgeInsets.all(15.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.gpp_good),
                  SizedBox(width: 2),
                  Expanded(
                    flex: 4,
                    child: Text(
                      "Welcome back, $header",
                      style: TextStyle(
                          color: Colors.grey[900],
                          fontWeight: FontWeight.bold,
                          fontSize: 16),
                      softWrap: true,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  )
                ],
              ),
              SizedBox(height: 5),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(width: 28),
                  Expanded(
                      flex: 4,
                      child: Text(
                        "You're currently logged in with the email $subtitle",
                        style: TextStyle(
                            color: Colors.grey[900],
                            fontWeight: FontWeight.w200,
                            fontSize: 14),
                        softWrap: true,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      )
                  )
                ],
              ),
            ],
          ),
        )
    );
  }

  Widget _listView() {
    return ListView(
      shrinkWrap: true,
      padding: EdgeInsets.symmetric(vertical: 8.0),
      children: _todos.map((Todo todo) {
        // return TodoItem(
        //   todo: todo,
        //   onTodoChanged: _handleTodoChange,
        // );
        return Dismissible(
            key: Key(todo.id),
            onDismissed: (direction) {
              _deleteTodo(todo);
            },
            background: Container(color: Colors.red),
            child: TodoItem(
              todo: todo,
              onTodoChanged: _handleTodoChange,
            )
        );
      }).toList(),
    );
  }

  Widget _bottomBar() {
    return BottomNavigationBar(
      backgroundColor: Colors.grey[200],
      items: const <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: Icon(Icons.done_all),
          label: 'To-Dos',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.logout),
          label: 'Log out',
        ),
      ],
      currentIndex: 0,
      selectedItemColor: Colors.blueAccent[800],
      onTap: _onItemTapped,
    );
  }

// Other functions
  Future<void> _displayDialog() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Add a new todo item'),
          content: TextField(
            controller: _textFieldController,
            decoration: const InputDecoration(hintText: 'Type your new todo'),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Add'),
              onPressed: () {
                Navigator.of(context).pop();
                _addTodoItem(_textFieldController.text);
              },
            ),
          ],
        );
      },
    );
  }
}
