// base....product.find()

// search=coder&page=3&limit=10&category=shortsleeves&rating[gte]=4;.....big query...

// &price[lte]=100&price[gte]=50

class WhereClause {
  constructor(base, bigQuery) {
    this.base = base;
    this.bigQuery = bigQuery;
  }

  search() {
    const searchWord = this.bigQuery.search
      ? {
          name: {
            $regex: this.bigQuery.search,
            $options: "i",
          },
        }
      : {};

    this.base = this.base.find({ ...searchWord });
    return this;
  }
}
