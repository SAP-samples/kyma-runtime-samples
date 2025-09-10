using my.bookshop as my from '../db/schema';

service CatalogService {
    @readonly entity Books as projection on my.Books;
}
