const path = require('path');
const fs = require('fs');
const exec = require('../utils/exec')


module.exports = class ManipulateJSON {

    constructor() {
        this.isModified = false;
    }
    static path(filepath) {
        try {
            this.isModified = false;
            if (!filepath) {
                this.json = null;
                this.filepath = null;
                return;
            }
            this.filepath = path.resolve(__dirname, "../", filepath);
            this.json = fs.readFileSync(this.filepath, {
                encoding: 'utf8'
            });
            this.json = JSON.parse(this.json);
        } catch (error) {
            this.json = null;
            console.log('File not found in a given path')
        }
        return this;
    }
    static get(param) {
        if (!param) return this.json;
        if (typeof param === 'string') {
            if (this.json) {
                return this.json[param];
            }
        } else {
            if (Array.isArray(this.json[param.key])) {
                let condition = false;
                var $or = param.cond.$or || [];
                var $and = param.cond.$and || [];
                let idx = this.json[param.key].findIndex(e => {
                    $or.forEach(or => {
                        for (let key in or) {
                            if (key in e) {
                                condition = condition || e[key] === or[key];
                            }
                        }
                    })
                    $and.forEach(or => {
                        for (let key in or) {
                            if (key in e) {
                                condition = condition && e[key] === or[key];
                            }
                        }
                    })
                    return condition;
                });
                if (idx >= 0) {
                    return this.json[param.key][idx];
                }
                return null;
            }
        }
        return null;
    }
    static set(a, b) {
        if (arguments.length == 2) {
            if (this.json) {
                this.json[a] = b;
                this.isModified = true;
            } else {
                console.error("Error : Please give a path")
            }
        } else {
            if (a.type == 'remove') {
                if (a.cond) {
                    if (Array.isArray(this.json[a.key])) {
                        let condition = false;
                        var $or = a.cond.$or || [];
                        var $and = a.cond.$and || [];
                        let idx = this.json[a.key].findIndex(e => {
                            $or.forEach(or => {
                                for (let key in or) {
                                    if (key in e) {
                                        condition = condition || e[key] === or[key];
                                    }
                                }
                            })
                            $and.forEach(or => {
                                for (let key in or) {
                                    if (key in e) {
                                        condition = condition && e[key] === or[key];
                                    }
                                }
                            })
                            return condition;
                        });
                        if (idx >= 0) {
                            this.isModified = true;
                            this.json[a.key].splice(idx, 1);
                        }
                    }
                } else {
                    if (a.key in this.json) {
                        this.isModified = true;
                        delete this.json[a.key];
                    }
                }
            } else if (a.type == 'modify') {
                if (a.cond) {
                    if (Array.isArray(this.json[a.key]) && Object.keys(a.data).length > 0) {
                        let condition = false;
                        var $or = a.cond.$or || [];
                        var $and = a.cond.$and || [];
                        let idx = this.json[a.key].findIndex(e => {
                            $or.forEach(or => {
                                for (let key in or) {
                                    if (key in e) {
                                        condition = condition || e[key] === or[key];
                                    }
                                }
                            })
                            $and.forEach(or => {
                                for (let key in or) {
                                    if (key in e) {
                                        condition = condition && e[key] === or[key];
                                    }
                                }
                            })
                            return condition;
                        });
                        if (idx >= 0) {
                            this.isModified = true;
                            for (let param in a.data) {
                                this.json[a.key][idx][param] = a.data[param];
                            }
                        }
                    }
                } else {
                    if (a.key in this.json) {
                        this.isModified = true;
                        for (let param in a.data) {
                            this.json[a.key][param] = a.data[param];
                        }
                    }
                }
            }
        }
        return this;
    }
    static async save() {
        if (this.json) {
            if (this.isModified) {
                var cmd = `sudo echo '${JSON.stringify(this.json)}'>${this.filepath}`;
                await exec(cmd)
                // fs.writeFileSync(this.filepath, JSON.stringify(this.json), {
                //     encoding: 'utf8'
                // });
            }
            this.json = null;
            this.filepath = null;
            this.isModified = false;
            return true;
        }
        return false;
    }

}