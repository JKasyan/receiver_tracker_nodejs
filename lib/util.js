/**
 * Created by 1 on 10/27/2016.
 */

exports.classOf = function classOf(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}