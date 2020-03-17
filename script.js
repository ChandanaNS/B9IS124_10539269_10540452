$(document).ready(function() {
  let jsonData,
    totPosts = 0,
    currentPage = 0,
    paginationCount = 5,
    filteredposts = [],
    catArr = [],
    authArr = [];

  loadJSON();

  /**
   * @event  onclick Navigation buttons
   * @description [Overview] On click of any navigation button, particular button gets higlighted and performs its functionality
   * @return void
   */
  $('body').on('click', '#home-blogs, #about-us, #blog-filter, #contact-us', function() {
    navValue = $(this).html();
    $('.ui-links').removeClass('active');
    $(this).addClass('active');

    if (navValue == 'Home') {
      $('.filter > *').trigger('click');
      loadJSON();
    } else if (navValue == 'About Us') {
      alert('We are having some issues, Please come back later to know about us');
    } else if (navValue == 'Blogs') {
      alert('Please click on author name or category to filter posts');
    } else {
      $('html, body').animate({
        scrollTop: $('#contact').position().top
      });
    }
  });

  /**
   * @event  onclick Navigation buttons
   * @description [Overview] JQUERY NAV TOGGLE for mobile devices
   * @return void
   */
  $('#nav-links-menu').bind('click', function(event) {
    $('#nav-links ul').slideToggle();
  });

  $(window).resize(function() {
    var w = $(window).width();
    if (w > 768) {
      $('#nav-links ul').removeAttr('style');
    }
  });

  /**
   * @event  onclick Pagination buttons
   * @description [Overview] Navigate between pages
   * @return void
   */
  $('.next, .prev').on('click', function(event) {
    try {
      console.info('On click pagination');
      if (event.target.name === 'prev') {
        currentPage--;
      } else {
        currentPage++;
      }
      var displayPosts = [];
      if (filteredposts.length > 0) {
        displayPosts = filteredposts;
      } else {
        displayPosts = jsonData;
      }
      generatePosts(displayPosts.slice(currentPage * paginationCount, currentPage * paginationCount + paginationCount));
    } catch (err) {
      console.error('Exception occurred onClick Navigation :  ' + err.message);
    }
  });

  /**
   * @event  onclick FilterButtons
   * @description [Overview] Select the list of posts from each author or category
   * @return void
   */

  $('.leftcolumn').on('click', '.authors-link , .categories-link', function() {
    try {
      console.info('Post selected based on filter');
      categoryValue = $(this)
        .text()
        .trim();
      categoryType = this.className;
      if (categoryType == 'categories-link') {
        catArr.indexOf(categoryValue) > -1 ? '' : catArr.push(categoryValue);
      } else {
        authArr.indexOf(categoryValue) > -1 ? '' : authArr.push(categoryValue);
      }
      filteredposts = jsonData.filter(function(v) {
        return authArr.length > 0
          ? catArr.length > 0
            ? authArr.indexOf(v.author) > -1 && catArr.indexOf(v.category) > -1
            : authArr.indexOf(v.author) > -1
          : catArr.indexOf(v.category) > -1;
      });
      currentPage = 0;
      generatePosts(
        filteredposts.slice(currentPage * paginationCount, currentPage * paginationCount + paginationCount),
        true
      );
      $('.leftcolumn > .filter').empty();
      for (var i = 0; i < catArr.length; i++) {
        $('.leftcolumn > .filter').append('<span>' + catArr[i] + '</span>');
      }
      for (var i = 0; i < authArr.length; i++) {
        $('.leftcolumn > .filter').append('<span>' + authArr[i] + '</span>');
      }
    } catch (err) {
      console.error('Exception occurred onClick author/category :  ' + err.message);
    }
  });

  $('.leftcolumn').on('click', '.filter > *', function() {
    var filterVal = $(this)
        .text()
        .trim(),
      index;
    $(this).remove();
    currentPage = 0;
    if (authArr.length > 0) {
      index = authArr.indexOf(filterVal);
      if (index > -1) {
        authArr.splice(index, 1);
      }
    }
    if (catArr.length > 0) {
      index = catArr.indexOf(filterVal);
      if (index > -1) {
        catArr.splice(index, 1);
      }
    }
    // filteredposts = [];
    if (authArr.length > 0 || catArr.length > 0) {
      filteredposts = jsonData.filter(function(v) {
        return authArr.length > 0
          ? catArr.length > 0
            ? authArr.indexOf(v.author) > -1 && catArr.indexOf(v.category) > -1
            : authArr.indexOf(v.author) > -1
          : catArr.indexOf(v.category) > -1;
      });
    } else {
      filteredposts = jsonData;
    }
    generatePosts(filteredposts.slice(currentPage * paginationCount, currentPage * paginationCount + paginationCount));
  });

  /**
   * @event  onclick Single post display
   * @description [Overview] Load every 5 data based on pagination
   * @return void
   */
  //Individual post
  $('.leftcolumn').on('click', '.readmore', function(event) {
    console.info('On click readmore');
    event.preventDefault();
    generatePosts(Array(jsonData[parseInt(this.id)]), false, true);
  });

  //Back to all data
  $('.leftcolumn').on('click', '.back', function(event) {
    console.info('On click back');
    event.preventDefault();
    var displayPosts = [];
    if (filteredposts.length > 0) {
      displayPosts = filteredposts;
    } else {
      displayPosts = jsonData;
    }
    generatePosts(displayPosts.slice(currentPage * paginationCount, currentPage * paginationCount + paginationCount));
  });

  //submit button
  $('body').on('click', '#contact-submit', function(event) {
    alert('Thank you');
  });

  /**
   * @method generatePosts
   * @description [Overview] process Posts functionality
   * @param {This method does not require any parameters} void
   * @return void
   */

  function generatePosts(data, authorfiltercalled = false, singlepost) {
    try {
      console.info('START :: generatePosts');
      $('html, body').animate({
        scrollTop: $('body').position().top
      });

      $(".leftcolumn > *:not('.filter')").remove();
      var leftcolumn = $('.leftcolumn').eq(0);
      var stringHtml = '';
      let otherImages;
      if (data.length === 0) {
        leftcolumn.append('No posts found');
      } else {
        for (let i = 0; i < data.length; i++) {
          if (singlepost != true) {
            stringHtml +=
              '<article id="' +
              i +
              '"class="card"><h2 class="post_title">' +
              data[i].title +
              '</h2><div><a href="#" class="authors-link">' +
              data[i].author +
              '&nbsp;</a><a href="#" class="categories-link">' +
              data[i].category +
              '</a>&nbsp;<span><time>' +
              data[i].datePosted +
              '&nbsp;</time></span></div ><img src=' +
              data[i].imagePath +
              ' class="fakeimg" alt="Author"/><p> ' +
              data[i].content +
              '</p><button class="readmore" id="' +
              data[i].id +
              '">Read More...</button></article>';
          } else {
            stringHtml +=
              '<article id="' +
              i +
              '"class="card singlecard"><h2 class="post_title">' +
              data[i].title +
              '</h2><figcaption><cite><a href="#" class="authors-link">' +
              data[i].author +
              '&nbsp;</a></cite><span><time>' +
              data[i].datePosted +
              '&nbsp;</time></span><a href="#" class="categories-link">' +
              data[i].category +
              '</a></figcaption ><img src=' +
              data[i].imagePath +
              ' class="fakeimg" alt="Author"/><ul class="image-list"></ul><p> ' +
              data[i].content +
              '</p><button class="back">Back</button></article>';
            otherImages = data[i].otherimages;
          }
          // i = previ;
        }
        leftcolumn.append(stringHtml);
        $('.leftcolumn').animate({
          scrollTop: $('.card:first-child').position().top
        });
        if (singlepost) {
          var $list = $('.image-list');
          $.each(otherImages, function(i, src) {
            var $li = $('<li class="loading">').appendTo($list);

            $('<img>')
              .appendTo($li)
              .one('load', function() {})
              .attr('src', src);
          });
          $('.pagination, .filter').hide();
        } else {
          $('.pagination, .filter').show();
        }
      }

      navigationControl(currentPage, totPosts, paginationCount);
      console.info('END :: generatePosts');
    } catch (err) {
      console.error('Exception occurred in generatePosts :  ' + err.message);
    }
  }

  /**
   * @method navigationControl
   * @description [Overview] Page Navigation Control
   * @param pagedetails currentPage, totPosts, paginationCount
   * @return void
   */
  function navigationControl(currentPage, totPosts, paginationCount) {
    let numberofpages =
      filteredposts.length > 0
        ? Math.ceil(filteredposts.length / paginationCount)
        : Math.ceil(totPosts / paginationCount);
    console.info('number of pages:: ' + numberofpages);
    $('.prev').removeAttr('disabled');
    $('.next').removeAttr('disabled');
    if (currentPage == 0 && currentPage >= numberofpages - 1) {
      $('.prev').attr('disabled', true);
      $('.next').attr('disabled', true);
    } else if (currentPage >= numberofpages - 1) {
      $('.next').attr('disabled', true);
    } else if (currentPage == 0) {
      $('.prev').attr('disabled', true);
    }
  }

  /**
   * @method loadJSON
   * @description [Overview] Access JSOn with localserver
   * @param {This method does not require any parameters} void
   * @return void
   */
  function loadJSON() {
    $.getJSON('JSON/posts.json', function(data) {
      console.info('Load JSON data');
      totPosts = data.length;
      jsonData = data;
      // Overview] Fetch unique categories
      var uniqueCategories = [];
      for (i = 0; i < data.length; i++) {
        if (uniqueCategories.indexOf(data[i].category) === -1) {
          uniqueCategories.push(data[i].category);
        }
      }
      generatePosts(jsonData.slice(currentPage * paginationCount, currentPage * paginationCount + paginationCount));
    });
  }
});
