// -------------filter,search,pagination

class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
        // this.queryStr.keyword => apple
        // this.query => Product.find()        
    }
    search() {        
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i' //here 'i' => incaseSensitive
            }
        } : {}
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        // console.log({ queryCopy });

        // removing field from query
        let removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(val => delete queryCopy[val]);

        // advance filter on price , ratings, etc
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|le|lte)\b/g, match => `$${match}`)
        // console.log({queryStr});
        // console.log({ queryCopy });
        this.query = this.query.find(JSON.parse(queryStr));
        return this;

    }

    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        // e.g==>10 products/page
        const skip = resPerPage * (currentPage - 1); //10 * (2-1)

        this.query = this.query.limit(resPerPage).skip(skip) //skip first 10 product
        return this;
    }

}
module.exports = APIFeatures