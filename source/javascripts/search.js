$(function () {
  var search_box = '#searchbox form';
  var query_input = search_box + ' input[name="search"]';
  var query_url = '_search/docs';
  if (window.location.host == 'docs.cloudant.com') { //different search url for production
    query_url = '/root/_design/couchapp/_search/docs';
  }

  var typeahead_opts = {
    minLength: 1,
    highlight: true
  };

  var typeahead_data = {
    name: 'doc_matches',
    source: compute_suggestions,
    displayKey: function (row) {
      return row.id;
    }
  };

  function compute_suggestions(query, cb) {
    $.get(query_url, { q: query + '*' }).done(function (response) {
      var res = JSON.parse(response);
      cb(res.rows);
    });
  }

  function on_submit(event) {
    $.get(query_url, { q: $(query_input).val() + '*' }).done(function (response) {
      var res = JSON.parse(response);
      if (res.total_rows > 0) {
        on_select(null, res.rows[0], null);
      }
    });
    /* console.log("onsubmit called");
    var section_id = $(query_input).val();
    var index = section_id.indexOf('-');
    var page = section_id.substring(0,index);
    var fragment = section_id.substring(index+1);
    var url = page + ".html#" + fragment;
    console.log("url = " + url);
    window.location.href = url;
    $('html, body').animate({
        scrollTop: $(document.getElementById(section_id)).offset().top
    }, 200);
    */
    return false;
  }
  
  function on_select(event, suggestion, dataset) {
    console.log("onsubmit called");
    var section_id = suggestion.id;
    var index = section_id.indexOf('-');
    var page = section_id.substring(0,index);
    var fragment = section_id.substring(index+1);
    var url = page + ".html#" + fragment;
    console.log("url = " + url);
    window.location.href = url;
  }

  $(query_input).typeahead(typeahead_opts, typeahead_data);
  $(query_input).bind('typeahead:selected', on_select);
  $(search_box).submit(on_submit);
});
