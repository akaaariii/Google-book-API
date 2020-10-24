$(function(){
    let favouriteBooks = localStorage.getItem('favourite') ? JSON.parse(localStorage.getItem('favourite')) : [];

    const getBooks = async(keyword) => {
        try {
            let result = await $.ajax({
                url: `https://www.googleapis.com/books/v1/volumes?q=${keyword}&projection=lite&key=${config.API_KEY}`,
                type: 'GET',
                dataType: 'json'
            })
            return sanitizeData(result);
        } catch (error){
            console.log(error);
        }
    }

    const redirectToBookPage = () => {
        $('img').click(e => {
            const target = $(e.target);
            const id = target.attr('id');
            document.location.href = `./book.html?id=${id}`;
        })
    }

    // Check if you have any data in the localStorage
    const checkFavourite = (item) => {
        const index = favouriteBooks.findIndex(e => e.id === item.id);
        return (index < 0) ? false : true;
    }

    const displayError = () => {
        $('.list').empty();
        let errorText = $('<p class="error"></p>').text('Something went wrong. Please try one more time.');
        $('.list').append(errorText);
    }

    const displayData = (items) => {
        $('.list').empty();
        items.forEach((data) => {
            const isFavourite = checkFavourite(data);

            const itemDiv = $('<div class="book-item"></div>');
            const headerDiv = $('<div class="header-item"></div>').attr('id', data.id);
            const icon = isFavourite ? $('<i class="fas fa-heart favourite"></i>') : $('<i class="fas fa-heart"></i>');
            const title = $('<h2></h2>').text(data.title);
            headerDiv.append(icon);
            headerDiv.append(title);
            itemDiv.append(headerDiv);
            const author = $('<h4></h4>').text(`by ${data.authors[0]}`);
            itemDiv.append(author);
            const innerDiv = $('<div class="inner-item"></div>');
            const img = $('<img>').attr('src', data.image.thumbnail).attr('id', data.id);
            innerDiv.append(img);
            // const desc = $('<p></p>').text(data.description);
            // innerDiv.append(desc);
            itemDiv.append(innerDiv);
            $('.list').append(itemDiv);
        })
        redirectToBookPage();
    }

    const sanitizeData = (response) => {
        let data = [];
        response.items.forEach((d) => {
            data.push({
                id: d.id,
                title: (typeof d.volumeInfo.title === 'undefined') ? 'There is no title for this book' : d.volumeInfo.title,
                authors: (typeof d.volumeInfo.authors === 'undefined') ? 'There is no author for this book' : d.volumeInfo.authors,
                // description: (typeof d.volumeInfo.description === 'undefined') ? 'There is no description for this book' : d.volumeInfo.description,
                image: d.volumeInfo.imageLinks 
            })
        })
        return data;
    }

    $('.form_inline').submit(e => {
        e.preventDefault();
        let keyword = $('#keyword').val();
        let bookData = [];
        getBooks(keyword)
            .then(value => {
                displayData(value);
                bookData = value;
            })
            .then(() => {
                $('.fa-heart').click((e) => {
                    let target = $(e.target);
                    let isFav = target.hasClass('favourite');
                    // let targetParent = target.closest('div');
                    let targetId = target.closest('div').attr('id');
                    const favBook = bookData.find(e => e.id === targetId);
                    const favIndex = favouriteBooks.findIndex(e => e.id === targetId)
                    if(!isFav){
                        favouriteBooks.push(favBook); // add to the array
                    } else {
                        favouriteBooks.splice(favIndex, 1); // delete from the array
                    }
                    localStorage.setItem('favourite', JSON.stringify(favouriteBooks));
                    target.toggleClass('favourite');
                })
            })
            .catch(error => {
                displayError();
            })
    })

})