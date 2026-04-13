import Map "mo:core/Map";

module {
  // Old Product type (from previous deployed version — no isNewArrival field)
  type OldProduct = {
    id : Nat;
    categoryId : Nat;
    name : Text;
    description : Text;
    moq : Text;
    imageUrls : [Text];
    featured : Bool;
    createdAt : Int;
  };

  // New Product type (matches current main.mo)
  type NewProduct = {
    id : Nat;
    categoryId : Nat;
    name : Text;
    description : Text;
    moq : Text;
    imageUrls : [Text];
    featured : Bool;
    isNewArrival : Bool;
    createdAt : Int;
  };

  type OldActor = {
    productsMap : Map.Map<Nat, OldProduct>;
  };

  type NewActor = {
    productsMap : Map.Map<Nat, NewProduct>;
  };

  public func run(old : OldActor) : NewActor {
    let productsMap = old.productsMap.map<Nat, OldProduct, NewProduct>(
      func(_id, p) {
        { p with isNewArrival = false }
      }
    );
    { productsMap };
  };
};
