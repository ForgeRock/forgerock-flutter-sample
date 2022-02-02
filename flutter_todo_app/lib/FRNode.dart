import 'FRCallback.dart';

class FRNode {
  final String header;
  final String authServiceId;
  final String stage;
  final String authId;
  final String description;
  final List<FRCallback> callbacks;

  FRNode({required this.header, required this.authServiceId, required this.stage, required this.authId, required this.description, required this.callbacks});

  factory FRNode.fromJson(Map<String, dynamic> parsedJson){

    var list = parsedJson['callbacks'] as List;
    print(list.runtimeType);
    List<FRCallback> frCallbackList = list.map((i) => FRCallback.fromJson(i)).toList();


    return FRNode(
        header: parsedJson['header'],
        authServiceId: parsedJson['authServiceId'],
        stage: parsedJson['stage'],
        authId: parsedJson['authId'],
        description: parsedJson['description'],
        callbacks: frCallbackList
    );
  }

  Map<String, dynamic> toJson() => {
    'header': header,
    'authServiceId': authServiceId,
    'stage': stage,
    'authId': authId,
    'description': description,
    'callbacks': callbacks,
  };
}