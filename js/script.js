var switchItemMenuToActive = function (itemNum) {
    // Remove 'active' from all buttons
    var classes ="" ;
    classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;
    classes = document.querySelector("#navMenuButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navMenuButton").className = classes;
    classes = document.querySelector("#navAboutButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navAboutButton").className = classes;
    document.querySelector("#navContactButton").className = classes;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navContactButton").className = classes;
  
    switch (itemNum) {
      case 0 :
        classes = document.querySelector("#navHomeButton").className;
        if (classes.indexOf("active") == -1) {
        classes += " active";
        document.querySelector("#navHomeButton").className = classes;
        }
        break ;
      case 1 :
        classes = document.querySelector("#navMenuButton").className;
        if (classes.indexOf("active") == -1) {
        classes += " active";
        document.querySelector("#navMenuButton").className = classes;
        }
        break ;
      case 2 :
        classes = document.querySelector("#navAboutButton").className;
        if (classes.indexOf("active") == -1) {
          classes += " active";
          document.querySelector("#navAboutButton").className = classes;
        }
        break ;
      case 3 :
          classes = document.querySelector("#navContactButton").className;
          if (classes.indexOf("active") == -1) {
            classes += " active";
            document.querySelector("#navContactButton").className = classes;
          }
          break ;
      default :
        classes = document.querySelector("#navHomeButton").className;
        if (classes.indexOf("active") == -1) {
        classes += " active";
        document.querySelector("#navHomeButton").className = classes;
        }
        break ;
    
      
    };
  
    
};

(function (global) {

    var dc = {};
    
    var mycats ="" ;
    var homeHtml = "snippets/home-snippet.html";
    var allCategoriesUrl = "data/cats.json" ;
      //"https://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    var menuItemsUrl = 'data/menu_items_new.json' ;
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";
    var currentCategory = '' ;
    var aboutHtml = 'snippets/about-snippet.html' ;
    var contactHtml = 'snippets/contactform-snippet.html'


    
      
    // Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
    
};
  
  // Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
 };
  
 // on page load 
document.addEventListener ("DOMContentLoaded", function(event){
    
    showLoading("#main-content");
    switchItemMenuToActive(0);
    $ajaxUtils.sendGetRequest(
        homeHtml,
        function (responseText) {
            document.querySelector("#main-content").innerHTML = responseText;
        },
        false);
});

// Load the menu categories view
dc.loadMenuCategories = function () {
    // switchItemMenuToActive(1) ;
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowCategoriesHTML);
    
};

dc.loadMenuItems = function (categoryShort) {

  console.log ("Loading : "+categoryShort) ;
  showLoading("#main-content");
  currentCategory = categoryShort ;
  $ajaxUtils.sendGetRequest(
    menuItemsUrl,
    buildAndShowMenuItemsHTML);
};

dc.loadAboutPage = function () {
  console.log ("in about") ;
  showLoading("#main-content");
  switchItemMenuToActive(2);
  $ajaxUtils.sendGetRequest(
    aboutHtml, function(responseText){
    document.querySelector("#main-content").innerHTML = 
    responseText ;
    },false) ; 
  
};

// Load the menu categories view
dc.loadContactPage = function () {
  showLoading("#main-content");
  switchItemMenuToActive(3);
  $ajaxUtils.sendGetRequest(
    contactHtml, function(responseText){
    document.querySelector("#main-content").innerHTML = 
    responseText ;
    },false) ; 
  
};
  
// Builds HTML for the categories page based on the data
// from the server
function buildAndShowCategoriesHTML (categories) {
    // Load title snippet of categories page
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        // Retrieve single category snippet
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function (categoryHtml) {
            // Switch CSS class active to menu button
            //switchMenuToActive();
            
            // switchItemMenuToActive(1);
            
            var categoriesViewHtml =
              buildCategoriesViewHtml(categories,
                                      categoriesTitleHtml,
                                      categoryHtml);
            insertHtml("#main-content", categoriesViewHtml);
            mycats = categories ;
          },
          false);
      },
      false);
  }  

function buildCategoriesViewHtml(categories,
    categoriesTitleHtml,
    categoryHtml) {


   
var finalHtml = categoriesTitleHtml;
finalHtml += "<section class='row'>";

// Loop over categories
for (var i = 0; i < categories.length; i++) {
// Insert category values
var html = categoryHtml;
var name = "" + categories[i].name;
var short_name = categories[i].short_name;
html =
insertProperty(html, "name", name);
html =
insertProperty(html,
"short_name",
short_name);
finalHtml += html;
}

finalHtml += "</section>";
return finalHtml;
}

function buildAndShowMenuItemsHTML (categoryMenuItems) {
  // Load title snippet of menu items page
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      // Retrieve single menu item snippet
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          // Switch CSS class active to menu button
          switchItemMenuToActive(1);
          
          var menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems,
                                   menuItemsTitleHtml,
                                   menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}


// Using category and menu items data and snippets html
// build menu items view HTML to be inserted into page
function buildMenuItemsViewHtml(acategoryMenuItems, 
                                menuItemsTitleHtml,
                                menuItemHtml) {
  console.log(mycats) ;
  console.log(currentCategory) ;
  const curitems = acategoryMenuItems.filter (obj => {
    return (obj.category === currentCategory) ;
  }) ; 
  const curcat = mycats.filter (obj =>{
    return (obj.short_name===currentCategory) ;
  }) ;                      
  //categoryMenuItems = {"menu_items":acategoryMenuItems,"category":mycats[1]};
        categoryMenuItems = {"menu_items":curitems,"category":curcat[0]} ;
  console.log("category name "+categoryMenuItems.category) ;
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
// Loop over menu items
var menuItems = categoryMenuItems.menu_items;
var catShortName = categoryMenuItems.category.short_name;
for (var i = 0; i < menuItems.length; i++) {
  // Insert menu item values
  var html = menuItemHtml;
  html =
    insertProperty(html, "short_name", menuItems[i].short_name);
  html =
    insertProperty(html,
                   "catShortName",
                   catShortName);
  html =
    insertItemPrice(html,
                    "price_0",
                    menuItems[i].price_0);
  html = insertItemPortionName(html, "meat_0",
                  menuItems[i].meat_0) ;

  
  html = insertItemPrice_1(html,
                    "price_1",
                    menuItems[i].price_1);
  
  html = insertItemPortionName(html, "meat_1",
                    menuItems[i].meat_1) ;
  
  
  html =
    insertItemPrice_1(html,
                          "price_2",
                          menuItems[i].price_2);
  html = insertItemPortionName(html, "meat_2",
                          menuItems[i].meat_2) ;
  
  html = insertProperty(html,
                   "name",
                   menuItems[i].name);

  
    
  

  html = insertProperty(html,
                   "description",
                   menuItems[i].description);

  // Add clearfix after every second menu item
  // if (i % 2 != 0) {
  //   html +=
  //     "<div class='clearfix visible-lg-block visible-md-block'></div>";
  // }

  finalHtml += html;
  }
  finalHtml += "</section>";
  return finalHtml;
}

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
      .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }

function insertItemPrice(html,
    pricePropName,
    priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
  return insertProperty(html, pricePropName, "");;
  }
  //priceValue = "$" + priceValue.toFixed(2);
    // priceValue = "$"+priceValue ;
    priceValue = priceValue ;
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }
  
  // Appends price with '$' if price exists
  function insertItemPrice_1(html,
    pricePropName,
    priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
  return insertProperty(html, pricePropName, "");;
  }
    //priceValue = "$" + priceValue.toFixed(2);
    // priceValue = "$"+priceValue ;
    // priceValue = "<br>"+priceValue ;
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }

  // Appends portion name in parens if it exists
function insertItemPortionName(html,
    portionPropName,
    portionValue) {
// If not specified, return original string
if (!portionValue) {
return insertProperty(html, portionPropName, "");
}

// portionValue = portionValue ;
html = insertProperty(html, portionPropName, portionValue);
return html;
}


global.$dc = dc;

})(window);

 