/*!jQuery plugins modified by cywhale 201808, according to the two open sources: 
 * jQuery Searchable Plugin v1.0.0 * https://github.com/stidges/jquery-searchable
 * Copyright 2014 Stidges Released under the MIT license
 * and easyPaginate * jQuery easyShare plugin Update on 04 april 2017 Version 1.2
 * Licensed under GPL <http://en.wikipedia.org/wiki/GNU_General_Public_License>
 * Copyright (c) 2008, St?hane Litou <contact@mushtitude.com> All rights reserved.
 */
 // Now we call easyPaginate() from the "searchable" main function, modified by cywhale
  $.fn.easyPaginate = function (options) {
    var defaults = {
        //currentPage: 1,
        paginateElement: 'p',
        hashPage: 'p',
        elementsPerPage: 15,
        effect: 'default',
        slideOffset: 200,
        firstButton: true,
        firstButtonText: '<<',
        lastButton: true,
        lastButtonText: '>>',        
        prevButton: true,
        prevButtonText: '<',        
        nextButton: true,
        nextButtonText: '>', 
        enableSideFig: true, //It's very specific by case
    /* We show figures in sidebar and using jQuery fancybox, but it needs re-bind after pagination. 
       So after pagination, we trigger fancybox. And if the hashtag is abuout figure, scroll to the fig. It's very speific by your case and CSS. We use a global enable to turn on/off this feature. 
       Check fancybox setting in getfancybox()*/
        hashFig: 'figx_'
    };
    return this.each (function (instance) {        
        var plugin = {};
        plugin.el = $(this);
        plugin.el.addClass('easyPaginateList');
        plugin.settings = {
            pages: 0,
            objElements: Object,
            currentPage: 1
        };
        var getNbOfPages = function() {
            return Math.ceil(plugin.settings.objElements.length / plugin.settings.elementsPerPage);    
        };
        var getfancybox = function() {
          $('a.fbox').fancybox({ // use class "fbox" as fancybox 
            closeBtn: false,
            showCloseButton : false,
            enableEscapeButton: true,
            hideOnOverlayClick: false,
            hideOnContentClick: false,
            helpers : {
              title: {
                type: 'inside',
                position: 'top'
              }
            },
            nextEffect: 'fade',
            prevEffect: 'fade',
            beforeLoad: function () {
              slideMove = false;
            },
            beforeShow: function () {
              this.title = $(this.element).data("alt"); // show data-alt as fig caption
            }
          });
        };
        
        var displayNav = function() {
            htmlNav = '<div class="easyPaginateNav"><br><br>';
            
            if(plugin.settings.firstButton) {
                htmlNav += '<a href="#'+plugin.settings.hashPage+':1" title="First page" rel="1" class="first">'+plugin.settings.firstButtonText+'</a>';
            }
            if(plugin.settings.prevButton) {
                htmlNav += '<a href="" title="Previous" rel="" class="prev">'+plugin.settings.prevButtonText+'</a>';
            }
            for(i = 1;i <= plugin.settings.pages;i++) {
                htmlNav += '<a href="#'+plugin.settings.hashPage+':'+i+'" title="Page '+i+'" rel="'+i+'" class="page">'+i+'</a>';
            }
            if(plugin.settings.nextButton) {
                htmlNav += '<a href="" title="Next" rel="" class="next">'+plugin.settings.nextButtonText+'</a>';
            }
            if(plugin.settings.lastButton) {
                htmlNav += '<a href="#'+plugin.settings.hashPage+':'+plugin.settings.pages+'" title="Last page" rel="'+plugin.settings.pages+'" class="last">'+plugin.settings.lastButtonText+'</a>';
            }
            htmlNav += '</div>';
            plugin.el.$nav = $(htmlNav);
            plugin.el.$nav.css({
                'width': plugin.el.width()
            });
            plugin.el.after(plugin.el.$nav);

            var elSelector = '#' + plugin.el.get(0).id + ' + ';
            $(elSelector + ' .easyPaginateNav a.page,'
                + elSelector + ' .easyPaginateNav a.first,'
                + elSelector + ' .easyPaginateNav a.last').on('click', function(e) {
                e.preventDefault();
                displayPage($(this).attr('rel'));
                $('html').scrollTop(0);
                
              var thisHash = window.location.hash;
              if(window.location.hash && plugin.settings.enableSideFig) {
                getfancybox();
              }
            });
            $(elSelector + ' .easyPaginateNav a.prev').on('click', function(e) {
                e.preventDefault();
                page = plugin.settings.currentPage > 1?parseInt(plugin.settings.currentPage) - 1:1;
                displayPage(page);
                $('html').scrollTop(0);
              if(window.location.hash && plugin.settings.enableSideFig) {
                getfancybox();
              }
            });
            $(elSelector + ' .easyPaginateNav a.next').on('click', function(e) {
              e.preventDefault();
              page = plugin.settings.currentPage < plugin.settings.pages?parseInt(plugin.settings.currentPage) + 1:plugin.settings.pages;
              displayPage(page);
              $('html').scrollTop(0);
              if(window.location.hash && plugin.settings.enableSideFig) {
                getfancybox();
              }
            });
        };
        
        var displayPage = function(page, forceEffect) {
            if(plugin.settings.currentPage != page) {
                plugin.settings.currentPage = parseInt(page);
                offsetStart = (page - 1) * plugin.settings.elementsPerPage;
                offsetEnd = page * plugin.settings.elementsPerPage;
                if(typeof(forceEffect) != 'undefined') {
                    eval("transition_"+forceEffect+"("+offsetStart+", "+offsetEnd+")");
                }else {
                    eval("transition_"+plugin.settings.effect+"("+offsetStart+", "+offsetEnd+")");
                }
                
                plugin.el.$nav.find('.current').removeClass('current');
                plugin.el.$nav.find('a.page:eq('+(page - 1)+')').addClass('current');
                
                switch(plugin.settings.currentPage) {
                    case 1:
                        $('.easyPaginateNav a', plugin).removeClass('disabled');
                        $('.easyPaginateNav a.first, .easyPaginateNav a.prev', plugin).addClass('disabled');
                        break;
                    case plugin.settings.pages:
                        $('.easyPaginateNav a', plugin).removeClass('disabled');
                        $('.easyPaginateNav a.last, .easyPaginateNav a.next', plugin).addClass('disabled');
                        break;
                    default:
                        $('.easyPaginateNav a', plugin).removeClass('disabled');
                        break;
                }
                history.pushState(null, null, '#'+plugin.settings.hashPage+plugin.settings.currentPage);
            }
        };
        var transition_default = function(offsetStart, offsetEnd) {
            plugin.currentElements.hide();
            plugin.settings.objElements.slice(0,offsetStart).css('display','none');
            plugin.settings.objElements.slice(offsetEnd,plugin.settings.objElements.length).css('display','none');
            plugin.settings.objElements.slice(offsetStart, offsetEnd).css('display','block');
            plugin.currentElements = plugin.settings.objElements.slice(0,plugin.settings.objElements.length);//.slice(offsetStart, offsetEnd);//.clone();
            plugin.el.html(plugin.currentElements);
            //plugin.currentElements.show();
        };
        plugin.settings = $.extend({}, defaults, options);
        plugin.currentElements = $([]);
        plugin.settings.objElements = plugin.el.find(plugin.settings.paginateElement);
        plugin.settings.pages = getNbOfPages();
        
        var pagex= parseInt(document.location.hash.replace('#'+plugin.settings.hashPage, ''));
        var figx = parseInt(document.location.hash.replace('#'+plugin.settings.hashFig, ''));
        if(plugin.settings.pages > 1) {
            plugin.el.html();
            displayNav();
            
            page = 1;
            if(document.location.hash.indexOf('#'+plugin.settings.hashPage) != -1) {
                page = pagex;
                if(page.length <= 0 || page < 1 || page > plugin.settings.pages) {
                    page = 1;
                }
            } 
            displayPage(page, 'default'); 
        }
        if (plugin.settings.enableSideFig) {
          if (figx != -1 && figx > 0) {
            history.pushState(null, null, '#figx_'+figx);
          }
        }
    });
  };
// Original searchable
(function( $, window, document, undefined ) {
    var pluginName = 'searchable',
        defaults   = {
            selector: 'tbody tr',
            childSelector: 'td',
            pagination: 'easySearch', 
            searchField: '#search',
            exactField: '#exactbox',
            pageItemField: '#pageItems',
            striped: false,
            oddRow: { },
            evenRow: { },
            hide: function( elem ) { elem.hide(); },
            show: function( elem ) { elem.show(); },
            searchType: 'fuzzy', //'default'
            onSearchActive: false,
            onSearchEmpty: false,
            onSearchFocus: false,
            onSearchBlur: false,
            clearOnLoad: false,
            elementsPerPage: 15,
            enableSideFig: true, //It's very specific by case followed comments in aboving easyPaginate
    /* If want to unify the parameters in both seachable and easyPaginate, use $.extend(curr_sets..)*/
            hashFig: 'figx_',
            hashKey: 'key',   // specific by case, key value is use <mark id="key.."> for anchor in html 
            blockFig:'marginnote' /* old version: blkfigure, but now blkfigure move to sidebar, enclosed by .marginnote. The CSS selector that let figures shown in sidebar even when Searching. The pagination changes when searching (only parts of searched items shown in main column, including only parts of figures). Change CSS setting in your sidebar as turn on/off in function switchSidebar() */
        },
        searchActiveCallback = false,
        searchEmptyCallback = false,
        searchFocusCallback = false,
        searchBlurCallback = false;

    function isFunction(value) {
        return typeof value === 'function';
    }
    function sliceObj(obj) {
      var o = {}, 
          keys = [].slice.call(arguments, 1);
      for (var i=0; i<keys.length; i++) {
          if (keys[i] in obj) o[keys[i]] = obj[keys[i]];
      }
      return o;
    }
    
    function switchSidebar() { // Needed only when you have a sidebar switch #swside (checkbox)
      var checkbox = document.querySelector("#swside");
      if (!checkbox.checked) { // Note that decide to turn on/off CSS class by case, by your design.
        $('#swside').prop("checked", !$('#swside').prop('checked')); 
        $(".marginnote").css({"display": "block", "width": "33%"}); //marginnote came from tufte.css for R markdown document, but can be any other sidebar css setting by case.
        $(".sidenote").css({"display": "block", "width": "33%"});
        $(".leader").css({"width": "55%"});
        $(".footinfo > div").css({"max-width": "50%"});
      }
    }

/*The following code to solve IE6-8 not support array.reduce in js */
    if ( 'function' !== typeof Array.prototype.reduce ) {
        Array.prototype.reduce = function( callback, opt_initialValue ) {
            'use strict';

            if ( null === this || 'undefined' === typeof this ) {
                throw new TypeError(
                'Array.prototype.reduce called on null or undefined' );
            }
            if ( 'function' !== typeof callback ) {
                throw new TypeError( callback + ' is not a function' );
            }
            var index, value,
                length = this.length >>> 0,
                isValueSet = false;

            if ( 1 < arguments.length ) {
                value = opt_initialValue;
                isValueSet = true;
            }
            for ( index = 0; length > index; ++index ) {
                if ( this.hasOwnProperty( index ) ) {
                    if ( isValueSet ) {
                        value = callback( value, this[ index ], index, this );
                    } else {
                        value = this[ index ];
                        isValueSet = true;
                    }
                }
            }
            if ( !isValueSet ) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            return value;
        };
    }
    function Plugin( element, options ) {
        this.$element = $( element );
        this.settings = $.extend( {}, defaults, options );
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            this.$searchElems = $( this.settings.selector, this.$element );
            this.$search = $( this.settings.searchField );  // seachable field
            this.$exactbox = $( this.settings.exactField ); // checkbox to perform exact search
            this.$pageItem = $( this.settings.pageItemField );// Items per page select menu
            this.$pagictent = $("#easyPaginate", this.$element);//All items in field for pagination 
            this.$blockelems = $("."+this.settings.blockFig, this.$element);//block of figures are in pagination but not searchable
            this.$nav = $([]); //pagination navbar
            this.matcherFunc  = this.getMatcherFunction( this.settings.searchType );
            this.determineCallbacks();
            this.bindEvents();
            this.updateStriping();
        },

        determineCallbacks: function() {
            searchActiveCallback = isFunction( this.settings.onSearchActive );
            searchEmptyCallback = isFunction( this.settings.onSearchEmpty );
            searchFocusCallback = isFunction( this.settings.onSearchFocus );
            searchBlurCallback = isFunction( this.settings.onSearchBlur );
        },
        bindEvents: function() {
            var that = this; 

            this.$search.on( 'change keyup', function() {
              that.$element.css("display", "block");//let all be searchable!
              that.$blockelems.hide();//find('img').css("display", "none");
              that.search( $( this ).val() );
              that.updateStriping(); 
            });

            if ( searchFocusCallback ) {this.$search.on( 'focus', this.settings.onSearchFocus );}
            if ( searchBlurCallback ) {this.$search.on( 'blur', this.settings.onSearchBlur );}

            if ( this.settings.clearOnLoad === false ) {
                this.$search.val( '' );
                this.$search.trigger( 'change' );
            }
            if ( this.$search.val() !== '' ) {
              this.$search.trigger( 'change' );
            }
            
            this.$exactbox.change(function() {
              if (this.checked) { //.is(":checked"))
                that.matcherFunc = that.getMatcherFunction('strict');
              } else {
                that.matcherFunc = that.getMatcherFunction('fuzzy');
              }
            });

            this.$pageItem.trigger('change');
            
            this.$pageItem.on('change', function() {
              var pgitemval = that.$pageItem.val();
              //var curr_sets = sliceObj(that.settings, 'paginateElement', 'hashPage');
              var curr_sets = (({ paginateElement, hashPage }) => ({ paginateElement, hashPage }))(that.settings);
              //var curr_sets = ['paginateElement', 'hashPage'].reduce(function(o, k) { o[k] = that.settings[k]; return o; }, {});
              curr_sets = $.extend(curr_sets, {elementsPerPage: parseInt(pgitemval)});
              that.$element.children().remove('.easyPaginateNav');
              that.$pagictent.easyPaginate(curr_sets);//Call easyPagination
            });
            
        // listen anchor click and jump pages
          this.$pagictent.on('click', 'a[href^="#' +that.settings.hashKey + '"]', function(e) {
            e.preventDefault();
            var hash = $.attr(this, 'href').substr(1);
            var pgitemval = that.$pageItem.val();
            //var $targ= $('[name="' + hash + '"]'); //<a name version
            var $targ= $('#' + hash); //<mark id>
            var idxp = $targ.parents(that.settings.paginateElement).index();
            var pagex= 1 + Math.floor(idxp / parseInt(pgitemval)); //that.settings.elementsPerPage);
            if (idxp==-1) {
              alert("Key not find: " + hash);
            } else {
              that.$element.children('.easyPaginateNav').find('[rel="' + pagex + '"]').trigger('click');
              window.history.replaceState("", document.title, window.location.href.replace(location.hash, "") + '#p'+pagex);
              $('html, body').animate({scrollTop: $targ.offset().top - 50}, 500);
              //history.pushState(null, null, '#'+hash);
            }
          });
       // listen figx anchor click and open sidebar
          this.$pagictent.on('click', 'a[href^="#' +that.settings.hashFig + '"]', function(e) { // hashFig
            if (that.settings.enableSideFig) {
              switchSidebar();
            }
           var hash = $.attr(this, 'href').substr(1);
           var pgitemval = that.$pageItem.val();
           var $targ= $('#' + hash); 
           var idxp = $targ.parents(that.settings.paginateElement).index();
           var pagex= 1 + Math.floor(idxp / parseInt(pgitemval)); 
           if (idxp==-1) {
             alert("Key not find: " + hash);
           } else {
             that.$element.children('.easyPaginateNav').find('[rel="' + pagex + '"]').trigger('click');
             window.history.replaceState("", document.title, window.location.href.replace(location.hash, "") + '#' + hash);
             $('html, body').animate({scrollTop: $targ.offset().top - 150}, 500);
           }
         });
        },
        updateStriping: function() {
            var that     = this,
                styles   = [ 'oddRow', 'evenRow' ],
                selector = this.settings.selector + ':visible';

            if ( !this.settings.striped ) {return;}
            $( selector, this.$element ).each( function( i, row ) {
                $( row ).css( that.settings[ styles[ i % 2 ] ] );
            });
        },
        search: function( term ) {
            //const getSubset = (keys, obj) => keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {});
            var curr_sets = (({ elementsPerPage, paginateElement, hashPage }) => ({ elementsPerPage, paginateElement, hashPage }))(this.settings);
            //var curr_sets = sliceObj(this.settings, 'elementsPerPage', 'paginateElement', 'hashPage');
            //var curr_sets = ['elementsPerPage','paginateElement', 'hashPage'].reduce(function(o, k) { o[k] = this.settings[k]; return o; }, {});
            var matcher, elemCount, children, childCount, hide, $elem, i, x;
            var totpages= Math.ceil(this.$pagictent.length / this.settings.elementsPerPage);
            var curr_page=1;
            var selectedval = this.$pageItem.val();//$(".select option:selected")
            
            if (selectedval) {
              curr_sets = $.extend(curr_sets, {elementsPerPage: parseInt(selectedval)});
            }

            if ( $.trim( term ).length === 0 ) {
              if(document.location.hash.indexOf('#'+this.settings.hashPage) != -1) {
                curr_page = parseInt(document.location.hash.replace('#'+this.settings.hashPage, ''));
                if(curr_page.length <= 0 || curr_page < 1 || curr_page > totpages) {
                    curr_page = 1;
                }
              }
              if (this.$element.children().find('.easyPaginateNav').length>0) { //Initialize
                  curr_sets = $.extend( {currentPage: curr_page}, curr_sets);
              }
              
              if (!this.settings.enableSideFig) { // Because now had sidebar switch to contro show()
                this.$blockelems.show();//find('img').css("display", "inline-block");
              }
              this.$element.children().remove('.easyPaginateNav');
              this.$pagictent.easyPaginate(curr_sets);//Call easyPagination
              return this;
            } else if ( searchActiveCallback ) {
              this.settings.onSearchActive( this.$element, term );
            }
            elemCount = this.$searchElems.length;
            matcher   = this.matcherFunc( term );

            for ( i = 0; i < elemCount; i++ ) {
                $elem      = $( this.$searchElems[ i ] );
                children   = $elem.find( this.settings.childSelector );
                childCount = children.length;
                hide       = true;

                for ( x = 0; x < childCount; x++ ) {
                    if (matcher($(children[x]).text().replace(/^\s*\./g,'').trim())) {
                        hide = false;
                        break;
                    }
                }
                if ( hide === true ) {
                    this.settings.hide( $elem );
                } else {
                    this.settings.show( $elem );
                }
            }
        },
        getMatcherFunction: function( type ) {
            if ( type === 'strict') {
              return this.getStrictMatcher;
            }
            if ( type === 'fuzzy' ) {
                return this.getFuzzyMatcher;
            }
            return this.getDefaultMatcher;
        },
        getStrictMatcher: function( term ) {
            term = $.trim( term );
            return function( s ) { return ( s.indexOf( term ) !== -1 ); };
        },
        getFuzzyMatcher: function( term ) {
            var regexMatcher,
                pattern = term.split( '' ).reduce( function( a, b ) {
                    return a + '[^' + b + ']*' + b;
                });
            regexMatcher = new RegExp( pattern, 'i' ); //g: global, will not reset index to 0

            return function( s ) { return regexMatcher.test( s ); };
        },
        getDefaultMatcher: function( term ) {
            term = $.trim( term ).toLowerCase();
            return function( s ) { return ( s.toLowerCase().indexOf( term ) !== -1 ); };
        }
    };
    $.fn[ pluginName ] = function( options ) {
        return this.each( function() {
            if ( !$.data( this, 'plugin_' + pluginName ) ) {
                $.data( this, 'plugin_' + pluginName, new Plugin(this, options) );
            }
        });
    };
})( jQuery, window, document );
