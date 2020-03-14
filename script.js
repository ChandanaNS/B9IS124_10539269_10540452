$(document).ready(function() {
  let jsonData,
    totPosts = 0,
    currentPage = 0,
    paginationCount = 5,
    filteredposts = [];

  loadJSON();
  // JQUERY NAV TOGGLE
  $('#nav-links-menu').bind('click', function(event) {
    $('#nav-links ul').slideToggle();
  });

  $(window).resize(function() {
    var w = $(window).width();
    if (w > 768) {
      $('#nav-links ul').removeAttr('style');
    }
  });
  //header active class toggle
  $('.nav-links ul li a').on('click', '.ui-links', function() {
    console.info('Navigation links');
    $('.ui-links').removeClass('active');
    $(this).addClass('active');
  });

  /**
   * @event  onclick Pagination buttons
   * @description [Overview] Access JSOn with localserver
   * @return void
   */
  $('.next, .prev').on('click', function(event) {
    try {
      console.info('On click pagination');
      // loadPage();
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
      console.log('Post selected based on filter');
      categoryValue = $(this).html();
      categoryType = this.className;

      filteredposts = jsonData.filter(function(v) {
        let filterBasedOn;
        categoryType == 'categories-link' ? (filterBasedOn = v.category) : (filterBasedOn = v.author);
        return categoryValue.indexOf(filterBasedOn) > -1;
      });
      console.log(filteredposts);
      currentPage = 0;
      generatePosts(
        filteredposts.slice(currentPage * paginationCount, currentPage * paginationCount + paginationCount),
        true
      );
      $('.leftcolumn')
        .find('.filter')
        .remove();
      $('.leftcolumn').append('<div class="filter">' + categoryValue + '</div>');
    } catch (err) {
      console.error('Exception occurred onClick author/category :  ' + err.message);
    }
  });

  $('body').on('click', '.filter', function() {
    $(this).remove();
    currentPage = 0;
    filteredposts = [];
    generatePosts(jsonData.slice(currentPage * paginationCount, currentPage * paginationCount + paginationCount));
  });

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
    generatePosts(jsonData.slice(currentPage * paginationCount, currentPage * paginationCount + paginationCount));
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
      $(".leftcolumn > *:not('.filter')").remove();
      var leftcolumn = $('.leftcolumn').eq(0);
      var stringHtml = '';
      let previ, otherImages;
      if (data.length === 0) {
        leftcolumn.html('No posts found');
      } else {
        for (let i = 0; i < data.length; i++) {
          // previ = i;
          // if (authorfiltercalled) {
          //   i = parseInt(data[i].id);
          // }
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

  //Pagination control
  function navigationControl(currentPage, totPosts, paginationCount) {
    let numberofpages =
      filteredposts.length > 0
        ? Math.ceil(filteredposts.length / paginationCount)
        : Math.ceil(totPosts / paginationCount);
    console.log('number of pages:: ' + numberofpages);
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
   * @event  getJSON
   * @description [Overview] Access JSOn with localserver
   * @return generatePosts
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
      console.log(uniqueCategories);
      generatePosts(jsonData.slice(currentPage * paginationCount, currentPage * paginationCount + paginationCount));
    });
  }
});
