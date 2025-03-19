# Javascript

> Summary

JavaScript classes are a way to create blueprints for objects, introduced in ES6 (ECMAScript 2015). They provide a cleaner, more structured syntax for object-oriented programming (OOP) compared to the older prototype-based approach. Classes allow you to define properties and methods that can be reused to create multiple object instances.

Here’s a breakdown of JavaScript classes and how to use them:

------

**1. Basic Syntax**

A class is defined using the class keyword, followed by the class name (by convention, class names are capitalized). Inside the class, you define a special constructor method to initialize object properties, and other methods to define behavior.

javascript

```javascript
class Person {
  // Constructor to initialize properties
  constructor(name, age) {
    this.name = name; // 'this' refers to the instance being created
    this.age = age;
  }

  // Method
  sayHello() {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }
}

// Creating an instance of the class
const person1 = new Person("Alice", 25);
console.log(person1.sayHello()); // Output: "Hello, my name is Alice and I am 25 years old."
```

- **constructor**: Runs automatically when a new instance is created with the new keyword. It sets up the initial state of the object.
- **Methods**: Defined inside the class and shared across all instances. No need for the function keyword.

------

**2. Creating Instances**

You use the new keyword to create objects (instances) from a class. Each instance gets its own copy of the properties defined in the constructor, but methods are shared via the class prototype.

javascript

```javascript
const person2 = new Person("Bob", 30);
console.log(person2.name); // Output: "Bob"
console.log(person2.sayHello()); // Output: "Hello, my name is Bob and I am 30 years old."
```

------

**3. Inheritance**

Classes can inherit properties and methods from another class using the extends keyword. This is useful for creating specialized versions of a base class.

javascript

```javascript
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age); // Call the parent class's constructor
    this.grade = grade;
  }

  study() {
    return `${this.name} is studying hard in grade ${this.grade}.`;
  }
}

const student1 = new Student("Charlie", 18, "12th");
console.log(student1.sayHello()); // Output: "Hello, my name is Charlie and I am 18 years old."
console.log(student1.study());   // Output: "Charlie is studying hard in grade 12th."
```

- **super**: Calls the parent class’s constructor or methods. It’s required in the child class constructor if you’re extending another class.

------

**4. Static Methods**

Static methods are defined with the static keyword and belong to the class itself, not its instances. They’re useful for utility functions related to the class.

javascript

```javascript
class MathHelper {
  static add(a, b) {
    return a + b;
  }
}

console.log(MathHelper.add(5, 3)); // Output: 8
// You can’t call static methods on instances: new MathHelper().add(5, 3) would fail
```

------

**5. Getters and Setters**

You can use get and set to control how properties are accessed or modified.

javascript

```javascript
class Person {
  constructor(name) {
    this._name = name; // Convention: underscore indicates "private" (not enforced)
  }

  get name() {
    return this._name;
  }

  set name(newName) {
    if (typeof newName === "string" && newName.length > 0) {
      this._name = newName;
    } else {
      console.log("Invalid name");
    }
  }
}

const person = new Person("Dave");
console.log(person.name); // Output: "Dave"
person.name = "Eve";      // Setter updates the value
console.log(person.name); // Output: "Eve"
person.name = "";         // Output: "Invalid name"
```

------

**6. Key Points**

- **Not Truly Private**: JavaScript doesn’t have true private properties yet (outside of using # private fields, introduced in ES2022). The underscore (_) is a convention for "private" properties.
- **Prototypal Inheritance**: Under the hood, classes are syntactic sugar over JavaScript’s prototype-based system.
- **Hoisting**: Unlike functions, class declarations are not hoisted. You must define a class before using it.

------

**Example: Putting It All Together**

javascript

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound.`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks loudly!`;
  }

  static isDog(obj) {
    return obj instanceof Dog;
  }
}

const dog = new Dog("Rex", "German Shepherd");
console.log(dog.speak());         // Output: "Rex barks loudly!"
console.log(Dog.isDog(dog));      // Output: true
console.log(dog instanceof Animal); // Output: true (inheritance)
```

------

**How to Use Classes**

1. **Define the Class**: Use class to create a template with a constructor and methods.
2. **Create Instances**: Use new to instantiate objects.
3. **Extend (Optional)**: Use extends for inheritance to build on existing classes.
4. **Add Logic**: Use methods, getters, setters, or static methods as needed.

Classes are great for organizing code, especially in larger projects where you need reusable, structured objects. Let me know if you’d like more examples or clarification!
