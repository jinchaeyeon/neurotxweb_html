"use strict";

var Components = {
  
  spinner: function(){
    let html = '<div class="spinner-grow" role="status">';
        html += '    <span class="sr-only">Loading...</span>';
        html += '</div>';

    return $(html);
  },

  boxSpinner: function(){
    let html = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

    return $(html);
  },

  noneData: function(text){
    let html = '<tr>';
    html += '  <td colspan="10" class="alignC">' + text + '</td>';
    html += '</tr>';

    return $(html);
  },

  common: {
    subtitle: $('.subheader-title'),
    submitButton: $('button[type="submit"]')
  }
}