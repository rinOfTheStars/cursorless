class_name ExampleClass
extends Node

var foobar : int

var declared_strict : String = "hi"

var declared = 1.1

var lambda = func (c):
    print(c)

func _init(foo: int, bar: int):
    foobar = foo + bar

func doSomething(something : String):
    print(something)

func _ready():
    doSomething("hello!")
    lambda.call("waow")

func _process(delta):
    pass