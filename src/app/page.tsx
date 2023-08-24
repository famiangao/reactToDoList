'use client'
//使用use client是客户端组件和服务端组件的界限，服务端组件无法进行响应式更改，但不占缓存，速度更快
import styles from './page.module.scss'
//怎么引入确实是个问题,要静心,效率高点儿,这样可以少来几趟,多玩儿玩儿
import {useReducer, useState,useRef} from 'react'
import type {Dispatch} from 'react'

export default function Home() {
    // 好困啊，，，哎，，，搁这儿坐了一天感觉啥也没干，，
    // 算了算了，，循序渐进，，今天先康复训练一下
    //todoList这个今天必须写完，然后其中要用到状态管理和context上下文，困困，，
    const aaa=useRef(null)
    //存放主要内容的地方肯定要用一个全局变量存储 ..
    let [tasks, dispatch] = useReducer(listContentReducer, listContext);

    //return中的内容分组件展示，，其实不用，，感觉画蛇添足，，屑
    return (
        <div className={styles.main}>

            <div className={styles.page_center}>
                <TopContent listContextDispatch={dispatch}></TopContent>
                <MainContent listContext={tasks} listContextDispatch={dispatch}></MainContent>
                {/*<div>{JSON.stringify(tasks)}</div>*/}
            </div>
        </div>
    )
}
const listContext: IListContext[] = [
    {
        finish: false,
        content: "第一条内容",
        id: 0
    }
]

function listContentReducer(tasks: IListContext[], action: IAction) {
    let result: IListContext[]
    switch (action.type) {
        //作为添加语法id肯定是自动生成的
        case "add": {
            result = [
                {
                    finish: false,
                    content: action.content,
                    id: tasks.length
                },
                ...tasks
            ]
            break;
        }
        case "del": {
            result = tasks.filter((item) => {
                return item.id != action.id
            })
            break;
        }
        case "change": {
            result = tasks.reduce((lastArr: IListContext[], item) => {
                if (item.id !== action.id) {
                    lastArr.push(item);
                } else {
                    lastArr.push({
                        ...item,
                        content: action.content
                    })
                }
                return lastArr;
            }, [])
            break;
        }
        default: {
            throw Error("未知类型" + action.type);
        }

    }
    return result;
}

function TopContent({listContextDispatch}: { listContextDispatch: Dispatch<IAction> }): any {
    function handleAdd(param: string) {
        let addContent: any = document.querySelector("#addContext");

        listContextDispatch({
            type: "add",
            content: addContent.value
        });
        console.log("运行了点击事件");//函数是没有this指向的
    }

    return (
        <div className={styles.top}>
            <div className={styles.line}>
                <span className={`${styles.normal_btn} ${styles.line_btn}`} onClick={handleAdd.bind({}, "")}>加</span>
                <input type="text" id="addContext"/>
            </div>

            {/*<div className={styles.line}>*/}
            {/*    <span className={`${styles.normal_btn} ${styles.line_btn}`}>查</span>*/}
            {/*    <input type="text"/>*/}
            {/*</div>*/}

        </div>
    )

}

function MainContent({
                         listContext,
                         listContextDispatch
                     }: { listContext: IListContext[], listContextDispatch: Dispatch<IAction> }) {
    const [changeId, setChangeId] = useState(-1);

    function handleDel(delId: number) {
        listContextDispatch({
                content: "",
                id: delId,
                type: "del"
            }
        )
    }

    function handleToChange(changeId: number) {
        setChangeId(changeId);
    }

    function handleExitChange(){
        setChangeId(-1)
    }

    function handleChange(changeId:number){
        let value:any=document.querySelector("#listChangeInput")
        listContextDispatch({
            type:"change",
            id:changeId,
            content:value.value
        })
        handleExitChange();
    }
    let contextList = listContext.map((item) => {
        let showContext;
        if (item.id === changeId) {
            showContext = (
                <>
                    <div>
                        {item.id + 1} ：<input type="text" id="listChangeInput"/>
                    </div>
                    <div>
                        <span className={`${styles.normal_btn} ${styles.line_btn}`}
                              onClick={handleExitChange.bind({})}>取消</span>
                        <span className={`${styles.normal_btn} ${styles.line_btn}`}
                              onClick={handleChange.bind({}, item.id)}>确定</span>
                    </div>
                </>
            )
        } else {
            showContext = (
                <>
                    <div>{item.id + 1} ： {item.content}</div>
                    <div>
                        <span className={`${styles.normal_btn} ${styles.line_btn}`}
                              onClick={handleDel.bind({}, item.id)}>删除</span>
                        <span className={`${styles.normal_btn} ${styles.line_btn}`}
                              onClick={handleToChange.bind({}, item.id)}>修改</span>
                    </div>
                </>
            )
        }
        return (
            <div className={styles.listContext} key={item.id}>
                {showContext}
            </div>
        )
    })

    return (
        <div className={styles.main_content}>{contextList}</div>
    )
}

interface IListContext {
    finish: boolean,
    content: string,
    id: number
}

interface IAction {
    type: string,
    content: string,//添加时要添加的内容
    id?: number,//要删除的id
    // [key:string]:any
}