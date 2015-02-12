Object.prototype.inlineTagging = function(otions) {
    if (this instanceof HTMLElement) {
        var inline = new InlineTagging(this);
    } else if (this.length > 0) {
        for (var i = 0; i <= this.length; i++) {
            var inline = new InlineTagging(this[i]);
        }
    }

};

var InlineTagging = function($input) {
    if (!$input)
        return;

    var $marker = null;
    var active = null;
    var lastSelected = null;
    var lastTerm = '';
    $input.focus();

    $input.onkeyup = function(e) {
        if (e.which == 40 || e.which == 38) {
            return;
        }
        lastTerm = getTerm($input.innerText);
        if (lastTerm && lastTerm.indexOf('@') > -1) {
            console.log(lastTerm);
            createMarker();
            $input.appendChild($marker);
            $marker.focus();
        } else {
            cleanUp();
        }
    };

    function createMarker() {
        if ($marker) {
            $marker.remove();
        }
        $marker = document.createElement('span');
        $marker.setAttribute('id', 'marker');
        $marker.setAttribute('contenteditable', 'false');
        $marker.innerHTML = '';
        $marker.appendChild(buildList([{
            text: 'ilya'
        }, {
            text: 'ilya2'
        }, {
            text: 'ilya3'
        }]));
        return $marker;
    }

    function buildList(listArray) {
        var list = document.createElement('ul');
        list.className = "nav nav-pills nav-stacked";
        list.setAttribute('tabindex', '-1');
        var that = this;
        listArray.forEach(function(item) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.innerHTML = item.text;
            li.data = item;
            li.onclick = function() {
               lastSelected = this.data;
               cleanUp();
            };
            li.appendChild(a);
            list.appendChild(li);
        });
        enableKeyNavigation(list);
        return list;
    }

   

    function enableKeyNavigation(ul) {
        active = ul.querySelector("li.active") || ul.querySelector("li");
        document.addEventListener("keydown", handler);
        document.addEventListener("mouseover", handler);
    }

    function handler(e) {
        active.classList.remove("active");
        $marker.focus();
        if (e.which == 40) {
            active = active.nextElementSibling || active;
        } else if (e.which == 38) {
            active = active.previousElementSibling || active;
        } else {
            active = e.target;
        }
        active.classList.add("active");
        if (e.which == 13) {
            $marker.focus();

            e.preventDefault();
            cleanUp();
        }
        if (active && active != lastSelected)
            lastSelected = active.data;
    }

    function cleanUp() {
        document.removeEventListener("keydown", handler);
        document.removeEventListener("mouseover", handler);

        if ($marker)
            $marker.remove();


        if (lastSelected && lastTerm) {
            var txt = $input.innerHTML;
            console.log('active!!!!!', lastTerm);
            $input.innerHTML = txt.replace(lastTerm, ' <strong contenteditable="false">' + lastSelected.text + '</strong> ');
            setTimeout(function() {
                placeCaretAtEnd($input);
            }, 10);
            lastSelected = null;
            lastTerm = '';
        }
    }

    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }

    function getTerm(str) {
        var res = str.match(/@(.*)/g);
        if (res) {
            return res[0].split(' ')[0];
        }
        return null;
    }
}
