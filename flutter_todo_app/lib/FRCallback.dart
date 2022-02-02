class FRCallback {
  final String type;
  final int id;
  final List<FRInputOutput> output;
  final List<FRInputOutput> input;


  FRCallback({required this.type, required this.id, required this.output, required this.input});

  factory FRCallback.fromJson(Map<String, dynamic> parsedJson){

    var outputList = parsedJson['output'] as List;
    List<FRInputOutput> frOutputList = outputList.map((i) => FRInputOutput.fromJson(i)).toList();

    var inputList = parsedJson['input'] as List;
    List<FRInputOutput> frInputList = inputList.map((i) => FRInputOutput.fromJson(i)).toList();


    return FRCallback(
        type: parsedJson['type'],
        id: parsedJson['_id'],
        output: frOutputList,
        input: frInputList
    );
  }

  Map<String, dynamic> toJson() => {
    'type': type,
    '_id': id,
    'output': output,
    'input': input
  };
}

class FRInputOutput {
  final String name;
  String value;

  FRInputOutput(this.name, this.value);

  FRInputOutput.fromJson(Map<String, dynamic> json)
      : name = json['name'],
        value = json['value'];

  Map<String, dynamic> toJson() => {
    'name': name,
    'value': value
  };
}
