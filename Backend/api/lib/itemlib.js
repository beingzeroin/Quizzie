exports.getAllItems = function(itemModel, cb) {
    console.log('Getting All Items');
    var query = {}; // get all
    itemModel.find(query, function(err, allDBItems) {
        cb(err, allDBItems);
    });
};

// populateJson = { path: 'fans', select: 'name' }
exports.getAllItemsWithPopulate = function(itemModel, populateJson, cb) {
    console.log('Getting All Items With Populate');
    var query = {}; // get all
    itemModel
        .find(query)
        .populate(populateJson)
        .exec(function(err, allDBItems) {
            cb(err, allDBItems);
        });
};

exports.getItemById = function(id, itemModel, cb) {
    console.log('Getting Single item with ID ' + id);
    itemModel.findById(id, function(err, singleDBItem) {
        cb(err, singleDBItem);
    });
};

exports.getItemByIdWithPopulate = function(id, itemModel, populateJson, cb) {
    console.log('Getting Single item by ID ' + id + ' with populate');
    itemModel
        .findById(id)
        .populate(populateJson)
        .exec(function(err, singleDBItem) {
            cb(err, singleDBItem);
        });
};

exports.getItemByQuery = function(query, itemModel, cb) {
    console.log('Getting item with Query ' + JSON.stringify(query));
    itemModel.find(query, function(err, allDBItems) {
        if (err) console.log('ERROR: ' + err);
        cb(err, allDBItems);
    });
};

exports.getItemByQueryWithPopulate = function(query, itemModel, populateJson, cb) {
    console.log('Getting item with Query ' + JSON.stringify(query) + ' with populate');
    itemModel.find(query).populate(populateJson).exec(function(err, allDBItems) {
        if (err) console.log('ERROR: ' + err);
        cb(err, allDBItems);
    })
};

exports.getItemByQueryWithSelect = function(query, itemModel, selectJson, cb) {
    console.log('Getting item with Query ' + JSON.stringify(query) + ' with select');
    itemModel.find(query).select(selectJson).exec(function(err, Allitems) {
        if (err) console.log('ERROR: ' + err);
        cb(err, Allitems);
    })
}

exports.getItemByQueryWithPopulateAndSelect = function(query, itemModel, populateJson, selectJson, cb) {
    console.log('Getting item with Query ' + JSON.stringify(query) + ' with populate and select');
    itemModel.find(query)
        .populate(populateJson)
        .select(selectJson)
        .exec(function(err, Allitems) {
            if (err) console.log('ERROR: ' + err);
            cb(err, Allitems);
        })
}

exports.createOrSkipByQuery = function(query, itemModel, itemDetails, cb) {
    console.log('Getting Single item with Query ' + JSON.stringify(query));
    itemModel.findOne(query, function(err, singleItem) {
        if (err) console.log('ERROR: ' + err);
        if (singleItem) {
            cb({ message: 'Skipping as this already exists' }, singleItem);
        } else {
            // INSERT
            exports.createitem(itemDetails, itemModel, cb);
        }
    });
};

exports.createOrUpdateByQuery = function(query, itemModel, itemDetails, cb) {
    console.log('Getting Single item with Query ' + JSON.stringify(query));
    itemModel.findOne(query, function(err, singleItem) {
        if (err) console.log('ERROR: ' + err);
        if (singleItem) {
            // UPDATE
            itemDetails._id = singleItem._id;
            itemDetails.updated_at = new Date();
            exports.updateItem(itemDetails, itemModel, cb);
        } else {
            // INSERT
            exports.createitem(itemDetails, itemModel, cb);
        }
    });
};

exports.getSingleItemByQuery = function(query, itemModel, cb) {
    console.log('Getting Single item with Query ' + JSON.stringify(query));
    itemModel.findOne(query, function(err, singleItem) {
        if (err) console.log('ERROR: ' + err);
        cb(err, singleItem);
    });
};

exports.getSingleItemByQueryAndSortedOnField = function(
    query,
    fieldName,
    itemModel,
    cb
) {
    console.log('Getting Single item with Query ' + JSON.stringify(query));
    itemModel
        .findOne(query)
        .sort(fieldName)
        .exec(function(err, singleItem) {
            if (err) console.log('ERROR: ' + err);
            cb(err, singleItem);
        });
};

exports.createitem = function(itemDetails, itemModel, cb) {
    console.log('Create New item for ' + JSON.stringify(itemDetails));
    var ti = new itemModel(itemDetails);
    ti.save(function(err) {
        if (err) console.log('ERROR ' + err);
        cb(err, ti);
    });
};

exports.updateItem = function(itemDetails, itemModel, cb) {
    console.log('Edit Resource ' + itemDetails._id);
    //console.log("MODEL: "+ JSON.stringify(itemModel))
    itemModel.findById(itemDetails._id, function(err, qObj) {
        if (err || !qObj) cb(err, null);
        else {
            if (itemDetails._id) delete itemDetails._id;

            console.log(JSON.stringify(itemDetails));
            for (var p in itemDetails) {
                //console.log(itemDetails[p])
                if (itemDetails[p]) qObj[p] = itemDetails[p];
            }

            // Save Updated Statement
            qObj.save(function(err) {
                cb(err, qObj);
            });
        }
    });
};

exports.updateItemField = function(query, updateDetails, itemModel, cb) {
    console.log('updating details...');
    itemModel.updateOne(query, updateDetails, (err, itemDetails) => {
        if (err) console.log('ERROR: ' + err);
        cb(err, itemDetails);
    });
};

exports.deleteMultipleItems = function(query, itemModel, cb) {
    console.log('Delete multiple resuorces which match ..' + query);
    itemModel.deleteMany(query, (err, details) => {
        if (err) console.log('ERROR: ' + err);
        cb(err, details);
    })
}
exports.deleteItem = function(id, softDelete, itemModel, cb) {
    console.log('Delete Resource ' + id);
    // cb(null, null); // Disabled Delete

    if (!softDelete) {
        itemModel.findByIdAndDelete(id, (err, details) => {
            if (err) console.log('ERROR: ' + err);
            cb(err, details);
        });
    } else {
        itemModel.findById(id, function(err, qObj) {
            if (err)
                cb(err, null);
            else {
                qObj.isDeleted = true;
                // Save Updated Statement
                qObj.save(function(err) {
                    cb(err, qObj);
                });
            }
        });
    }

};