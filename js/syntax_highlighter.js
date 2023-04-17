String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
 }

function normalize(text)
{
    text = text.toString().replace('<','&lt;');
    text = text.toString().replace('>','&gt;');
    text = text.toString().replace(' ','&nbsp;');
    return text;
}

function setCommentSyntax(innerHTML)
{
    const commentStartIndex = innerHTML.indexOf("//");
    return `<span class="syhigh-code">${innerHTML.slice(0,commentStartIndex)}</span><span class="syhigh-comment">${innerHTML.slice(commentStartIndex)}</span>`;
}

function highlightKeyword(code, keyword)
{

}

function getIndicesOf(searchStr, str) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function extendAt(text, index, length, left, right)
{
    return `${text.slice(0,index)}${left}${text.slice(index,index+length)}${right}${text.slice(index + length)}`;
}

function formatCode(code)
{
    const keywords = ["function","var","const","let","for","if","while","do","switch","case","default","return","break","continue","class ","this","document","toString"];
    const operators = ["&lt;","&gt;",";","=","+","*","/",".","-","(",")"," ","{","}","[","]"];
    const startKw = `<span class="syhigh-keyword">`;
    const startOp = `<span class="syhigh-operator">`;
    const end = `</span>`;
    keywords.forEach((keyword)=>{

        const offsetJump = startKw.length+end.length;
        operators.forEach((op)=>{
            code.innerHTML = code.innerHTML.replaceAll(`${keyword}${op}`    ,   `${startKw}${keyword}${end}${op}`);
        })
    });
    const opRegex = "\+|\(|\)|\=|&lt;|&gt;|\{|\}";
    [...code.childNodes].filter((c)=>c.nodeType == 3).forEach((el)=>{
        const newEl = document.createElement('span');
        newEl.innerText = el.nodeValue;
        code.replaceChild(newEl,el);
        console.log(newEl.innerHTML);
        //newEl.innerHTML = newEl.innerHTML.replaceAll(`(`,`${startOp}(${end}`);
        const offsetJump = startOp.length + end.length;
        allOccurences = [];
        opers = [];
        bannedIds = [];
        operators.filter(o => o != ' ').forEach((op)=>{
                const operatorOcc = getIndicesOf(op,newEl.innerHTML).filter((x)=>!bannedIds.includes(x));
                allOccurences.push(...operatorOcc);
                operatorOcc.forEach((x)=>{
                    opers.push({occ: x, oper: op});
                });
                if (op.length > 1)
                {
                    operatorOcc.forEach((oc)=>{
                        bannedIds.push(oc+op.length-1);
                    });
                }
            });
        let offset = 0;
        opers.sort((a,b) => a.occ - b.occ);
        console.log(allOccurences);
        console.log(opers);
        for (let i = 0; i < opers.length; i++)
        {
            newEl.innerHTML = extendAt(newEl.innerHTML,opers[i].occ+offset,opers[i].oper.length,startOp,end);
            console.log(newEl.innerHTML.length,offsetJump, newEl.innerHTML);
            offset += offsetJump ;
        }
    });
}

function reorganize(el)
{
    const div = document.createElement('code');
    div.classList.add('syntax-highlight-block');
    const lines = el.innerHTML.split('\n');
    console.log(lines);
    lines.forEach(element => {
        const p = document.createElement('p');
        p.classList.add('syhigh-line');
        p.innerHTML = element;
        if(p.innerHTML.includes("//"))
        {
            p.innerHTML = setCommentSyntax(p.innerHTML);
        }
        else
        {
            p.innerHTML = `<span class="syhigh-code">${p.innerHTML}</span>`;
        }
        const code = p.querySelector('.syhigh-code');
        formatCode(code);
        div.appendChild(p)
    });
    el.replaceWith(div);
}

const codeBlocks = document.getElementsByClassName('syntax-highlight-block');
[...codeBlocks].forEach((el) => reorganize(el));
