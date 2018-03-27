// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function generateGif() {
    var url = "https://api.giphy.com/v1/gifs/random?api_key=kdcRYWW6vIsCiok9TYs3X9opfYtOXpNg&rating=PG&tag=";
    var search = window.getSelection.toString();
    var apiCall = url + search;
    debugger;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", apiCall, false);
    xmlHttp.send(null);
    var response = xmlHttp.responseText;
    var gifUrl = JSON.parse(response).data.embed_url;
    var win = window.open(gifUrl, '_blank');
    win.focus();
}

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('load');
    // onClick's logic below:
    link.addEventListener('click', function() {
        generateGif();
    });
});


// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Generate Gif";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});  
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
    var url = "https://api.giphy.com/v1/gifs/random?api_key=kdcRYWW6vIsCiok9TYs3X9opfYtOXpNg&rating=PG&tag=" + info.selectionText;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    var response = xmlHttp.responseText;
    var gifUrl = JSON.parse(response).data.embed_url;
    var win = window.open(gifUrl, '_blank');
    win.focus();  
    
  //var url = "https://www.google.com/search?q=" + encodeURIComponent(sText);  
  //window.open(url, '_blank');
};