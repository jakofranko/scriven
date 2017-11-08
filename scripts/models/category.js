const CategoryModel = Backbone.Model.extend({
    defaults: {
        id: null,
        name: null
    }
});

const CategoriesCollection = Backbone.Collection.extend({
    url: 'http://localhost:3000/categories',
    model: CategoryModel,
    parse: function(data) {
        return data.categories;
    }
});

const CategoryItemView = Backbone.View.extend({
    tagName: 'div',
    className: 'r',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        let html = `<div class="c6"><span class="name">${this.model.get('name')}</span></div>
                    <div class="c6">
                        <button type="button" class="delete pv1 ph2">Delete</button>
                        <button type="button" class="edit pv1 ph2">Edit</button>
                    </div>`;
        this.$el.html(html);
        return this;
    },
    events: {
        'click .delete': 'onDelete',
        'click .edit': 'onEdit',
        'keydown .editing': 'onSubmit'
    },
    onDelete: function() {
        let yes = confirm(`Are you sure you want to delete the category '${this.model.get('name')}'?`);
        if(yes)
            this.model.destroy();
    },
    onEdit: function() {
        let $name = this.$('.name');
        let $parent = $name.parent();
        let val = $name.text();
        let input = document.createElement('input');
        input.value = val;
        input.classList = `editing`;
        input.name = `editing-${val}`;

        $parent.empty().append(input);
    },
    onSubmit: function(e) {
        if(e.key === 'Enter' && e.target.value) {
            this.model.set('name', e.target.value);
            this.model.save();
        }
    }
});

const CategoriesView = Backbone.View.extend({
    el: "#categories",
    initialize: function() {
        this.collection.fetch();
        this.listenTo(this.collection, 'sync change', this.render);
    },
    render: function() {
        let $list = this.$('#categories-list');
        $list.empty();

        this.collection.each(model => {
            let cat = new CategoryItemView({ model });
            $list.append(cat.render().$el);
        });

        return this;
    },
    events: {
        'keydown #new-category': 'onCreate'
    },
    onCreate: function(e) {
        let $name = this.$('#new-category');
        if(e.key === 'Enter' && $name.val()) {
            this.collection.create({ name: $name.val() });
            $name.val(null);
        }
    }
});

const CategoryOptionView = Backbone.View.extend({
    tagName: 'option',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        this.$el.attr('value', this.model.get('id'));
        this.$el.text(this.model.get('name'));
        return this;
    }
});

// These views won't be rendered directly, but used by other elements
const CategoriesDropdownView = Backbone.View.extend({
    tagName: 'select',
    initialize: function() {
        this.$el.attr('name', 'category_id');
        this.collection.fetch();
        this.listenTo(this.collection, 'sync change', this.render);
    },
    render: function() {
        this.$el.html(null);
        this.$el.append("<option value=''>Select Category</option>");
        this.collection.each(model => {
            let view = new CategoryOptionView({ model });
            this.$el.append(view.render().$el);
        });

        return this;
    }
});