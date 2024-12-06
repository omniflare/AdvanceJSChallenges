//testing with the configuration
const virtualNode = {
  type: "div",
  props: {
    class: "heading-container",
    children: {
      0: "This is",
      1: {
        type: "h1",
        props: {
          key: "10",
          id: "heading",
          children: "devtools.tech",
        },
      },
      2: {
        type: "h2",
        props: {
          id: "heading",
          children: "is Awesome!!",
        },
      },
      3: {
        type: "input",
        props: {
          type: "text",
          value: "Devtools Tech",
        },
      },
      4: {
        type: "button",
        props: {
          children: "Click",
        },
      },
      5: 0,
      6: {
        props: {
          children: {
            0: {
              type: "div",
              props: {
                children: "React",
              },
            },
            1: {
              type: "div",
              props: {
                children: "Fragment",
              },
            },
          },
        },
      },
      7: "",
    },
  },
};

//this translates to something like
// <div>
// This
// <h1 key='10'id='heading'>devtools.tech</h1>
// <h2 id='heading' > is Awesome</h2>
// <input type='text' value='devtoolsTech' />
// <button>Click </button>
// 0
// <>
// <div> react </div>
// <div> Fragment </div>
// </>
// </div>
const domNode = document.getElementById("root");

function render(node) {
  if (!node) {
    return null;
  }
  if (typeof node !== "object") {
    return document.createTextNode(node.toString());
  }
  // fragments
  if (!node.type && node.props && node.children) {
    const fragment = document.createDocumentFragment();
    const children = node.props.children || {};
    Object.keys(children).forEach(key => {
      const child = children[key];
      const childNode = render(child);
      if (childNode){
        element.appendChild(childNode);
      }
    })
    return fragment;
  }

  const element = document.createElement(node.type);
  const props = node.props || {};
  Object.keys(props).forEach((prop) => {
    if (prop == "children") {
      return;
    } else if (props == "class") {
      element.className = props[prop];
    } else {
      element.setAttribute(prop, props[prop]);
    }
  });
  
  if (props.children){
    if (typeof props.children == 'object' && !Array.isArray(props.children)){
      Object.keys(props.children).forEach(key => {
        const child = props.children[key];
        const childNode = render(child);
        if (childNode){
          element.appendChild(childNode);
        }
      })
    }else {
      const childNode = render(props.children);
      if (childNode){
        element.appendChild(childNode);
      }
    }
  }
}

function renderToDOM(virtualNode, domNode) {
  //high level algo
  // vn => actual related HTML elements
  // if N/A values => "", 0, null, undefined => do not convert them
  // proper htmlelements with children and props
  // fragments <> </> type is missing but props and children is present
  // primitive : string and numbers are present
  //
  // we want some sort of recursion for the application
  //
  const renderedContent = render(virtualNode);
  if (renderedContent) {
    domNode.appendChild(renderedContent);
  }
}

renderToDOM(virtualNode, domNode);
