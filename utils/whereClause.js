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

  filterProduct() {
    const copBigQ = { ...this.bigQuery };
    delete copBigQ["search"];
    delete copBigQ["page"];
    delete copBigQ["limit"];

    //convert big in to string;

    let bigQueryString = JSON.stringify(copBigQ);

    bigQueryString = bigQueryString.replace(/\b(gte|lte|gt|lt)\b/g, (match) => {
      return `$${match}`;
    });

    //convert big in to object;

    const bigQueryInObj = JSON.parse(bigQueryString);
    this.base = this.base.find(bigQueryInObj);
    return this;
  }

  pager(resultPerPage) {
    let currentPage = this.bigQuery.page || 1;
    let offset = (currentPage - 1) * resultPerPage;

    this.base = this.base.limit(resultPerPage).skip(offset);
    return this;
  }
}
