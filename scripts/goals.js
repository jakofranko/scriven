/**
 * Created by jdfrankl on 10/5/17.
 */

var categories = [];
categories.push(new Category({
    name: 'linguistics'
}));
categories.push(new Category({
    name: 'family'
}));
categories.push(new Category({
    name: 'home'
}));
categories.push(new Category({
    name: 'intake'
}));
categories.push(new Category({
    name: 'projects'
}));


categories.forEach(category => {
    switch(category.name) {
        case "linguistics":
            category.add(new Goal({
                name: "learn french",
                interval: "day",
                unit: "DuoLingo lessons",
                amount: 3
            }));
            category.add(new Goal({
                name: "French Fluency",
                interval: "milestone",
                unit: "percent fluent",
                amount: 25
            }));
            category.add(new Goal({
                name: "French Fluency",
                interval: "milestone",
                unit: "percent fluent",
                amount: 50
            }));
            category.add(new Goal({
                name: "French Fluency",
                interval: "milestone",
                unit: "percent fluent",
                amount: 75
            }));
            category.add(new Goal({
                name: "French Fluency",
                interval: "milestone",
                unit: "percent fluent",
                amount: 100
            }));
            break;
        case "family":
            category.add(new Goal({
                name: "date night",
                interval: "month",
                unit: "date",
                amount: 2
            }));
            break;
        case "home":
            category.add(new Goal({
                name: "yard work",
                interval: "week",
                unit: "hours",
                amount: 2
            }));
            category.add(new Goal({
                name: "cleaning",
                interval: "week",
                unit: "rooms",
                amount: 3
            }));
            category.add(new Goal({
                name: "dishes",
                interval: "day",
                unit: "times",
                amount: 1
            }));
            category.add(new Goal({
                name: "laundry room wall repaired",
                interval: "milestone",
                unit: "repairs",
                amount: 1
            }));
            category.add(new Goal({
                name: "Arizona room cleaned",
                interval: "milestone",
                unit: "rooms cleaned",
                amount: 1
            }));
            break;
        case "intake":
            category.add(new Goal({
                name: "read book",
                interval: "day",
                unit: "minutes",
                amount: 30
            }));
            category.add(new Goal({
                name: "Meaning of Marriage",
                interval: "milestone",
                unit: "book",
                amount: 1
            }));
            category.add(new Goal({
                name: "Spiritual Disciplines",
                interval: "milestone",
                unit: "book",
                amount: 1
            }));
            break;
        case "projects":
            category.add(new Goal({
                name: "make a code commit",
                interval: "day",
                unit: "code commit",
                amount: 1
            }));
            category.add(new Goal({
                name: "Finish Trauame vessel",
                interval: "milestone",
                unit: "project",
                amount: 1
            }));
            break;
        default:
            break;
    }
});