/*
works for ID
works for Class
Works for Tag
works for attribute
*/

const _ = (() => {

    const selectorEngine = (selector) => {
        if (!document.querySelectorAll) {

            // handling the selector selection for all the new browsers. Mostly all :) 
            return querySelectorElements(selector);
        } else {

            // handling the selector selection for the old browsers that does not support querySelector mechanism. This is for you, IE. :(
            return customSelectorElements(selector);
        }
    }

    const querySelectorElements = (selector) => {

        try {
            return document.querySelectorAll(selector);
        } catch (exception) {
            return null;
        }
    }

    const customSelectorElements = (selector) => {
        let allNodes;
        let currentDerivedNodes = [];
        let resultantNodes = [];
        let fullSelector = selector;

        if(!fullSelector){
            return resultantNodes;
        }

        fullSelector = fullSelector.split(" ");      

        function pushNode(node){
            if(i === fullSelector.length-1){
                resultantNodes.push(node);
            }else{
                currentDerivedNodes.push(node);
            }
        }

        for (var i = 0; i < fullSelector.length; i++) {

            allNodes = [];

            if(currentDerivedNodes[0]){
                for(let currentNodesCount = 0; currentNodesCount< currentDerivedNodes.length; currentNodesCount++){
                    allNodes = allNodes.concat(Array.prototype.slice.call(currentDerivedNodes[currentNodesCount].getElementsByTagName("*")));
                }
            }else{
                allNodes = document.getElementsByTagName("*");
            }

            debugger;
            
            //finding the elements on the basis of their order.
            for (let j = 0; j < allNodes.length; j++) {

                /*
                checking if the part of selector is an ID, Class or a tag name.
                */

                const selectorPart = fullSelector[i];
                let currentNode = allNodes[j];

                //slicing the first character to check if it is a class or an ID;

                // for ID
                if (selectorPart.charAt(0) === "#") {

                    let strippedSelectorPart = selectorPart.slice(1);

                    if (strippedSelectorPart === currentNode.getAttribute("id")) {
                        pushNode(currentNode);
                    }

                } else
                // for class
                if (selectorPart.charAt(0) === ".") {

                    let strippedSelectorPart = selectorPart.slice(1);

                    if (currentNode.className && currentNode.className.split(" ").includes(strippedSelectorPart)) {
                        pushNode(currentNode);
                    }

                } else
                // for attributes
                if (/\[.*?\]/.test(selectorPart)) {
                    let attribute = selectorPart.slice(1,-1);

                    let attributeName;
                    let attributeValue;

                    //segreggating the attribute name and its value
                    if(attribute.includes("=")){
                        [attributeName, attributeValue] = attribute.split("=");

                    }else{
                        attributeName = attribute;
                    }

                    //removing ^, $, * if the attribute contains them
                    let finalAttributeName = attributeName.replace("*","").replace("^","").replace("$","");
                    
                    var retrievedAttributeValue = currentNode.getAttribute(finalAttributeName);

                    if(!retrievedAttributeValue){
                        continue;
                    }

                    if(attribute.includes("=")){

                        if(attributeName.includes("*")){

                            if(retrievedAttributeValue.includes(attributeValue)){
                                pushNode(currentNode);
                            }

                        }else
                        if(attributeName.includes("^")){
                            
                            if(retrievedAttributeValue.startsWith(attributeValue)){
                                pushNode(currentNode);
                            }
                        
                        }else
                        if(attributeName.includes("$")){
                            
                            if(retrievedAttributeValue.endsWith(attributeValue)){
                                pushNode(currentNode);
                            }

                        }else{
                            if(retrievedAttributeValue === attributeValue){
                                pushNode(currentNode);
                            }
                        }
                        
                    }else{
                        pushNode(currentNode);
                    }

                }else
                // for Tag
                if (selectorPart === currentNode.nodeName.toLowerCase()) {
                    pushNode(currentNode);
                }
            }

        }

        return resultantNodes;
    }

    return (selector) => selectorEngine(selector);

})();