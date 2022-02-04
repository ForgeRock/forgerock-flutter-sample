import 'package:flutter/material.dart';
import 'package:flutter_todo_app/home.dart';
import 'package:flutter_todo_app/login.dart';
import 'package:flutter_todo_app/todolist.dart';

class Todo {
  Todo({required this.name, required this.checked});
  final String name;
  bool checked;
}

void main() => runApp(
  new TodoApp(),
);

class TodoApp extends StatefulWidget {
  @override
  _TodoAppState createState() => new _TodoAppState();
}

class _TodoAppState extends State<TodoApp> {
  int _selectedIndex = 0;

  final _pageOptions = [
    HomePage(),
    LoginPage(),
    TodoList(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      home: Scaffold(
        body: _pageOptions[_selectedIndex],
        bottomNavigationBar: BottomNavigationBar(
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.vpn_key),
              label: 'Sign In',
            ),
          ],
          currentIndex: _selectedIndex,
          selectedItemColor: Colors.blueAccent[800],
          onTap: _onItemTapped,
          backgroundColor: Colors.grey[200],
        )
      ),
    );
  }
}