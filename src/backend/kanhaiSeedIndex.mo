module {
  public type ProductSeed = {
    categoryId : Nat;
    name : Text;
    description : Text;
    moq : Text;
    imageUrls : [Text];
    sku : ?Text;
    subcategory : ?Text;
    color : ?Text;
    keyFeatures : ?Text;
  };
  public let allBatches : [[ProductSeed]] = [];
};
