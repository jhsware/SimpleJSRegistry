import expect from 'expect.js'

import { createInterfaceClass } from '../lib'
const Interface = createInterfaceClass('test')
import { createObjectPrototype } from '../lib'
import { Schema } from './mocks'

describe('Object Prototypes', function() {
    it('can be created', function() {
        var IUser = new Interface({name: 'IUser'});
        
        var userPrototype = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        var user = new userPrototype();
        
        expect(user).to.be.a(userPrototype);
        expect(user.sayHi()).to.be("Hi!");
    });

    it('can clone other Object Prototype', function() {
        var IUser = new Interface({name: 'IUser'});
        
        var userPrototype = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        var user = new userPrototype({ test: 'dummy' });
        var clone = new userPrototype(user);
        
        expect(clone).to.be.a(userPrototype);
        expect(clone.sayHi()).to.be("Hi!");

        var jsonUser = JSON.stringify(user.toJSON());
        var jsonClone = JSON.stringify(clone.toJSON());
        expect(jsonClone).to.equal(jsonUser);
        
        console.log(
          jsonUser,
          jsonClone,
          Object.keys(user),
          Object.keys(clone),
        )
        var propsUser = Object.keys(user).toString();
        var propsClone = Object.keys(clone).toString();
        expect(propsClone).to.equal(propsUser);
    });
    
    it("can inherit from other object prototypes", function() {
        var IUser = new Interface({name: 'IUser'});
        
        var userProto = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        var ISpecialUser = new Interface({name: 'ISpecialUser'});
        
        var specialUserProto = createObjectPrototype({
            extends: [userProto],
            implements: [ISpecialUser],
            sayHo: function () {
                return "Ho!"
            }
        })
        
        var user = new specialUserProto();
        
        expect(user).to.be.a(specialUserProto);
        expect(user.sayHi()).to.be("Hi!");
        expect(user.sayHo()).to.be("Ho!");
    });

    it("can inherit from other object prototypes and maintain this", function() {
        var IUser = new Interface({name: 'IUser'});
        
        var userProto = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return this.sayHo()
            },
            sayHo: function () {
                return "Wrong ho!"
            }
        })
        
        var ISpecialUser = new Interface({name: 'ISpecialUser'});
        
        var specialUserProto = createObjectPrototype({
            extends: [userProto],
            implements: [ISpecialUser],
            sayHo: function () {
                return "Ho!"
            }
        })
        
        var user = new specialUserProto();
        
        expect(user.sayHi()).to.be("Ho!");
    });
    
    it("can inherit from other object prototypes two levels deep", function() {
        var IUser = new Interface({name: 'IUser'});
        
        var userProto = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        var ISpecialUser = new Interface({name: 'ISpecialUser'});
        
        var specialUserProto = createObjectPrototype({
            extends: [userProto],
            implements: [ISpecialUser],
            sayHo: function () {
                return "Ho!"
            }
        })
        
        var user = new specialUserProto();
        
        var ISuperSpecialUser = new Interface({name: 'ISuperSpecialUser'});
        
        var superSpecialUserProto = createObjectPrototype({
            extends: [specialUserProto],
            implements: [ISuperSpecialUser],
            sayYay: function () {
                return "Yay!"
            }
        })
        
        var user = new superSpecialUserProto();
        
        expect(user).to.be.a(superSpecialUserProto);
        expect(user.sayHi()).to.be("Hi!");
        expect(user.sayHo()).to.be("Ho!");
        expect(user.sayYay()).to.be("Yay!");
    });

    it("can inherit from other object prototypes two levels deep and maintain this", function() {
        var IUser = new Interface({name: 'IUser'});
        
        var userProto = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return this.sayHo()
            },
            sayHo: function () {
                return "Wrong ho!"
            }
        })
        
        var ISpecialUser = new Interface({name: 'ISpecialUser'});
        
        var specialUserProto = createObjectPrototype({
            extends: [userProto],
            implements: [ISpecialUser],
            sayHo: function () {
                return "Wrong ho!"
            }
        })
        
        var user = new specialUserProto();
        
        var ISuperSpecialUser = new Interface({name: 'ISuperSpecialUser'});
        
        var superSpecialUserProto = createObjectPrototype({
            extends: [specialUserProto],
            implements: [ISuperSpecialUser],
            sayHo: function () {
                return "Ho!"
            }
        })
        
        var user = new superSpecialUserProto();
        
        expect(user.sayHi()).to.be("Ho!");
    });
    
    it("can inherit from other object prototypes two levels deep and call all constructors", function() {
        var IUser = new Interface({name: 'IUser'});
        
        var User = createObjectPrototype({
            implements: [IUser],
            constructor: function () {
                this.storedVal = (this.storedVal || '') + '1';
            },
            getStoredVal: function () {
                return this.storedVal;
            }
        })
        
        var ISpecialUser = new Interface({name: 'ISpecialUser'});
        
        var SpecialUser = createObjectPrototype({
            extends: [User],
            implements: [ISpecialUser],
            constructor: function (data) {
                this._IUser.constructor.call(this, data);
                this.storedVal = (this.storedVal || '') + '2';
            },
        })
                
        var ISuperSpecialUser = new Interface({name: 'ISuperSpecialUser'});
        
        var SuperSpecialUser = createObjectPrototype({
            extends: [SpecialUser],
            implements: [ISuperSpecialUser],
            constructor: function (data) {
                this._ISpecialUser.constructor.call(this, data);
                this.storedVal = (this.storedVal || '') + '3';
            },
        })
        
        var user = new SuperSpecialUser();
        
        expect(user).to.be.a(SuperSpecialUser);
        expect(user.getStoredVal()).to.equal("123");
        expect(user._IUser.getStoredVal.call(user)).to.equal("123");
    });
    
    it("can inherit from several other object prototypes call all constructors", function() {
        var IUser = new Interface({name: 'IUser'});
        
        var User = createObjectPrototype({
            implements: [IUser],
            constructor: function () {
                this.userVal = 1;
            }
        })
        
        var ISpecial = new Interface({name: 'ISpecial'});
        
        var Special = createObjectPrototype({
            implements: [ISpecial],
            constructor: function (data) {
                this.specialVal = 2;
            },
        })
                
        var ISuperSpecialUser = new Interface({name: 'ISuperSpecialUser'});
        
        var SuperSpecialUser = createObjectPrototype({
            extends: [Special, User],
            implements: [ISuperSpecialUser],
            constructor: function (data) {
                this._ISpecial.constructor.call(this, data);
                this._IUser.constructor.call(this, data);
                this.superSpecialVal = 3;
            },
        })
        
        var user = new SuperSpecialUser();
        
        expect(user).to.be.a(SuperSpecialUser);
        expect(user.userVal).to.equal(1);
        expect(user.specialVal).to.equal(2);
        expect(user.superSpecialVal).to.equal(3);
    });

    it("can inherit from other object prototype and calls inherited constructor if none is specified", function() {
        var IUser = new Interface({name: 'IUser'});
        
        var userProto = createObjectPrototype({
            implements: [IUser],
            constructor: function () {
                this.constructorCalled = true
            }
        })
        
        var ISpecialUser = new Interface({name: 'ISpecialUser'});
        
        var specialUserProto = createObjectPrototype({
            extends: [userProto],
            implements: [ISpecialUser]
        })
        
        var user = new specialUserProto();
        
        expect(user).to.be.a(specialUserProto);
        expect(user.constructorCalled).to.be(true);
    });

    it("can convert simple object to JSON", function() {
        var IUser = new Interface({name: 'IUser'});
        
        var User = createObjectPrototype({
            implements: [IUser],
            constructor: function () {
                this._userVal = 1;
                this.title = "title"
            }
        })
                
        var user = new User();
        
        var data = user.toJSON();
        
        expect(data).to.not.be(undefined);
        expect(data._userVal).to.equal(1);
        expect(data.title).to.equal("title");
        expect(JSON.stringify(user)).to.not.be(undefined);
    });
    
    it("can convert nested objects to JSON", function() {
        var IUser = new Interface({name: 'IUser'});
        
        var User = createObjectPrototype({
            implements: [IUser],
        })
                
        var user = new User({
            _userVal: 1,
            title: "parent"
        });
        
        var child = new User({
            title: "child"
        });
        
        user.child = child;
        
        var data = user.toJSON();
        
        expect(data).to.not.be(undefined);
        expect(data._userVal).to.equal(1);
        expect(data.title).to.equal("parent");
        expect(data.child.title).to.be("child");
        expect(JSON.stringify(user)).to.not.be(undefined);
    });
    
    it("can convert object with null values to JSON", function() {
        var IUser = new Interface({name: 'IUser'});
        
        var User = createObjectPrototype({
            implements: [IUser],
        })
                
        var user = new User({
            _userVal: 1,
            title: "parent",
            empty: null
        });
                
        var data = user.toJSON();
        
        expect(data).to.not.be(undefined);
        expect(data._userVal).to.equal(1);
        expect(JSON.stringify(user)).to.not.be(undefined);
    });
    
    it("can update value of properties", function() {
        var IUser = new Interface({
            name: 'IUser',
            schema: new Schema({
                title: "",
                empty: ""                    
            })
        });
        
        var User = createObjectPrototype({
            implements: [IUser],
        })
                
        var user = new User({
          _userVal: 1,
          title: "parent",
          empty: null
        });
        user.title = "updated";
        user.empty = "nope";
        
        expect(user.title).to.equal("updated");
        expect(user.empty).to.equal("nope");
    });

    it("can be created with an interface as property", function() {
      var IUser = new Interface({
          name: 'IUser',
          schema: new Schema({
              title: "",
              empty: ""                    
          })
      });

      var IAsProp = new Interface({})
      
      var User = createObjectPrototype({
          implements: [IUser],
      })
           
      var user = new User({
          myIProp: IAsProp
      });
      
      expect(user.myIProp.interfaceId).to.equal(IAsProp.interfaceId);
    });

    it("can convert object with function JSON", function() {
      var IUser = new Interface({
        name: 'IUser',
      });

      var IAsProp = new Interface({})
      
      var User = createObjectPrototype({
          implements: [IUser],
      })
              
      var user = new User({
          myIProp: IAsProp
      });
      
      var data = user.toJSON();
      
      expect(data.myIProp).to.be(undefined);
    });
  
    
    it("can remove schema field property", function() {
        var IUser = new Interface({
            name: 'IUser',
            schema: new Schema({
                title: "",
                empty: ""                    
            })
        });
        
        var User = createObjectPrototype({
            implements: [IUser],
        })
                
        var user = new User({
            _userVal: 1,
            title: "parent",
            empty: null
        });
        
        delete user.title;
        
        expect(user.title).to.be(undefined);
    });
    
    
    it("won't overwrite prototype properties", function() {
        var IUser = new Interface({
            name: 'IUser',
            schema: new Schema({
                title: "",
                empty: ""                    
            })
        });
        
        var User = createObjectPrototype({
            implements: [IUser],
        })
                
        var user = new User({
            _userVal: 1,
            title: "parent",
            empty: null
        });
        
        var data = user.toJSON();
        
        var newUser = new User(data);
        
        expect(newUser.hasOwnProperty('_implements')).to.equal(false);
    });

    it("adds schema fields for all implemented interfaces", function() {
        var IUser = new Interface({name: 'IUser', schema: new Schema({ name: '', age: '' })});
        var ILooks = new Interface({name: 'ILooks', schema: new Schema({ eyes: '', height: ''})});
        
        var userProto = createObjectPrototype({
            implements: [IUser, ILooks]
        })
        var user = new userProto();

        expect(user).to.have.property('name');
        expect(user).to.have.property('age');
        expect(user).to.have.property('eyes');
        expect(user).to.have.property('height');
    });

    it("checks for existence of all members in all interfaces", function() {
        var ITalker = new Interface({name: 'ITalker'});
        ITalker.prototype.talk = function () {};
        
        var IFlexer = new Interface({name: 'IFlexer'});
        IFlexer.prototype.flex = function () {};
        
        var userProto = createObjectPrototype({
            implements: [ITalker, IFlexer],
            talk: function () {},
            flex: function () {}
        })
        expect(userProto).to.not.be(undefined);

        var failed
        try {
            var userProto = createObjectPrototype({
                implements: [ITalker, IFlexer],
                flex: function () {}
            })
        } catch (e) {
            failed = true
        }
        expect(failed).to.equal(true);
    });
});