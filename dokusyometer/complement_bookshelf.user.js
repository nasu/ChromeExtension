// ==UserScript==
// @name   読書メーターカテゴリ入力補完
// @author nasu - http://www.google.co.jp/profiles/tatu.nasu#about
// ==/UserScript==
var obj = {
  categories: [],
  div_id: 'chrome-ext-complement-bookshelf',
  category_class: 'chrome-ext-mycategory',
  input_tag: $('input[type="text"][name="category"]'),
  getCategories: function(){
    var self = this;
    if (! self.categories.length) {
      //TODO サイトのHTML依存
      //var uid = $('div#top > div.inner > a:first').attr('href');
      var uid = $('a#navi_top_link_2').attr('href');
      if (uid.search(/^\/u\/\d+$/) == -1) {
        console.log('not found user\'s my page.');
        return self.categories;
      }
      var html = $.ajax({
        url: uid + '/cat', 
        async: false,
      }).responseText;
      //TODO サイトのHTML依存
      $(html).find('#side_left > div.inner > ul > li > a').each(function(){
        self.categories.push($(this).text().replace(/\(\d+\)$/, ''));
      });
    }
    return self.categories;
  },
  show: function(){
    var self = this;
    $('#' + self.div_id).show();
  },
  hide: function(){
    var self = this;
    $('#' + self.div_id).hide();
  },
  ready: function(){
    var self = this;
    //TODO サイトのHTML依存
    var area = $('div.book_edit_area');
    if (area.size() > 0) {
      area.append('<div id="' + self.div_id + '"></div>');
      self.hide();

      var categories = self.getCategories();
      //TODO 半角スペースと全角スペースわかりやすく
      var input_categories = self.input_tag.val().split(/[ 　]+/);
      $.each(categories, function(){
        var category = this.replace(/ /g, '');
        if ($.inArray(category, input_categories) >= 0) {
          //TODO rgb値を定数に
          $('#' + self.div_id).append('<span class="' + self.category_class + '" style="background-color:rgb(255,255,0);">' + category + '</span>')
        } else {
          $('#' + self.div_id).append('<span class="' + self.category_class + '">' + category + '</span>')
        }
      });
      $('.' + self.category_class).click(function(){obj.category_toggle(this)});
      $('.' + self.category_class).css({
        'margin':'0px 2px',
        'cursor':'pointer',
        'text-decoration':'underline',
      });
      self.show();
    }
  },
  category_toggle: function(obj){
    var self = this;
    if ($(obj).css('background-color').replace(/ /g, '') == 'rgb(255,255,0)') {
      $(obj).css({'background-color':'rgba(0,0,0,0)'});
    } else {
      $(obj).css({'background-color':'rgb(255,255,0)'});
    }
    //TODO たぶんmapでできる
    //TODO 存在していないカテゴリを入力していると消える
    var str = '';
    $('.' + self.category_class).each(function(){
      if ($(this).css('background-color').replace(/ /g, '') == 'rgb(255,255,0)') {
        str += $(this).text() + ' ';
      }
    });
    self.input_tag.val(str);
  }
}
obj.ready();
