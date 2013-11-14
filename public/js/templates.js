this["Nongo"] = this["Nongo"] || {};
this["Nongo"]["Templates"] = this["Nongo"]["Templates"] || {};

this["Nongo"]["Templates"]["Collection"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<ul class=\"nav nav-tabs\">\n  <li class=\"active\"><a href=\"#\">Documents</a></li>\n  <li><a href=\"#\">Indexes</a></li>\n</ul>\n\n<div id=\"collection-content\">\n\n</div>";
  });

this["Nongo"]["Templates"]["Collections"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div>\n  <button type=\"button\" class=\"btn btn-default js-refresh\">\n    <span class=\"glyphicon glyphicon-refresh\"></span>\n  </button>\n  <button type=\"button\" class=\"btn btn-default js-add\">Add document</button>\n</div>\n\n<table class=\"table table-striped\">\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Documents</th>\n      <th>Size</th>\n    </tr>\n  </thead>\n  <tbody>\n  </tbody>\n</table>";
  });

this["Nongo"]["Templates"]["CollectionsItem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<td><a href=\"/databases/";
  if (stack1 = helpers.databaseName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.databaseName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/collections/"
    + escapeExpression(((stack1 = depth0.name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-link=\"push\" >"
    + escapeExpression(((stack1 = depth0.name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></td>\n<td>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.humanizeCount || depth0.humanizeCount),stack1 ? stack1.call(depth0, depth0.count, options) : helperMissing.call(depth0, "humanizeCount", depth0.count, options)))
    + "</td>\n<td>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.humanizeByte || depth0.humanizeByte),stack1 ? stack1.call(depth0, depth0.size, options) : helperMissing.call(depth0, "humanizeByte", depth0.size, options)))
    + "</td>";
  return buffer;
  });

this["Nongo"]["Templates"]["Database"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<ul class=\"nav nav-tabs\">\n  <li class=\"active\"><a href=\"#\">Collections</a></li>\n  <li><a href=\"#\">Users</a></li>\n</ul>\n\n<div id=\"database-content\">\n\n</div>";
  });

this["Nongo"]["Templates"]["DatabaseItem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<td><a href=\"/databases/"
    + escapeExpression(((stack1 = depth0.db),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-link=\"push\" >"
    + escapeExpression(((stack1 = depth0.db),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></td>\n<td>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.humanizeByte || depth0.humanizeByte),stack1 ? stack1.call(depth0, depth0.dataSize, options) : helperMissing.call(depth0, "humanizeByte", depth0.dataSize, options)))
    + "</td>\n<td>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.humanizeByte || depth0.humanizeByte),stack1 ? stack1.call(depth0, depth0.fileSize, options) : helperMissing.call(depth0, "humanizeByte", depth0.fileSize, options)))
    + "</td>\n<td>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.humanizeCount || depth0.humanizeCount),stack1 ? stack1.call(depth0, depth0.collections, options) : helperMissing.call(depth0, "humanizeCount", depth0.collections, options)))
    + "</td>\n<td>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.humanizeCount || depth0.humanizeCount),stack1 ? stack1.call(depth0, depth0.objects, options) : helperMissing.call(depth0, "humanizeCount", depth0.objects, options)))
    + "</td>";
  return buffer;
  });

this["Nongo"]["Templates"]["Documents"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div>\n  <button type=\"button\" class=\"btn btn-default js-refresh\">\n    <span class=\"glyphicon glyphicon-refresh\"></span>\n  </button>\n  <button type=\"button\" class=\"btn btn-default js-add\">Add collection</button>\n</div>\n\n<ul class=\"documents\">\n\n</ul>";
  });

this["Nongo"]["Templates"]["DocumentsItem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- <a href=\"/databases/";
  if (stack1 = helpers.databaseName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.databaseName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/collections/"
    + escapeExpression(((stack1 = depth0.name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-link=\"push\" >"
    + escapeExpression(((stack1 = depth0._id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a> -->\n\n<div class=\"document-wrapper well\">\n    <div class=\"document\">";
  stack2 = ((stack1 = depth0.content),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div>\n</div>";
  return buffer;
  });

this["Nongo"]["Templates"]["Home"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\n\n<div>\n  <button type=\"button\" class=\"btn btn-default js-refresh\">\n    <span class=\"glyphicon glyphicon-refresh\"></span>\n  </button>\n  <button type=\"button\" class=\"btn btn-default\">Add database</button>\n</div>\n<table class=\"table table-striped\">\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Data Size</th>\n      <th>File Size</th>\n      <th>Collections</th>\n      <th>Objects</th>\n    </tr>\n  </thead>\n  <tbody>\n  </tbody>\n</table>";
  });