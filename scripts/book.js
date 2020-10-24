$(function(){
    const stringQuery = document.location.search;
    const paramsURL = new URLSearchParams(stringQuery);
    const bookId = paramsURL.get('id');

    const getBook = async() => {
        try {
            const response = await $.ajax({
                url: `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${config.API_KEY}`,
                type: 'GET',
                dataType: 'json'
            })
            return sanitizeBookData(response);
        } catch (error){
            console.log(error);
        }
    }

    const sanitizeBookData = (data) => {
        return {
            id: bookId,
            title: data.volumeInfo.title,
            author: data.volumeInfo.authors[0],
            categories: data.volumeInfo.categories,
            publisher: data.volumeInfo.publisher,
            publishedDate: data.volumeInfo.publishedDate,
            description: data.volumeInfo.description,
            imageLinks: data.volumeInfo.imageLinks,
            buyLink: data.saleInfo.buyLink
        }
    }


    const displayData = (data) => {
        const img = $('<img>').attr('src', data.imageLinks.thumbnail);
        $('.book-image').append(img);

        const title = $('<h1></h1>').text(data.title);
        $('.book-info').append(title);
        const author = $('<h2></h2>').text(`by ${data.author}`);
        $('.book-info').append(author);

        const categories = $('<h3></h3>').text('* Categories')
        const ul = $('<ul></ul>');
        data.categories.forEach((d) => {
            d = d.replaceAll('/', '-');
            const li = $('<li></li>').text(d);
            ul.append(li);
        })
        $('.book-info').append(categories);
        $('.book-info').append(ul);

        const publisher = $('<h3></h3>').text(`Sold by ${data.publisher} / ${data.publishedDate}`);
        $('.book-info').append(publisher);
        $('.book-info').append(data.description);

        const buyLink = $('<a class="store-link"></a>').attr('href', data.buyLink).attr('target', '_blank').text('Buy');
        $('.book-info').append(buyLink);
    }

    getBook().then((value) => {
        displayData(value);
    })
})