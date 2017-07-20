import React, { Component } from "react";

class Application extends Component {
    static STORAGE_KEY = 'blocked';

    constructor () {
        super();
        let words = this.getFromLocalStorage();

        this.state = {
            words
        };
    }

    getWindowLocalStorage () {
        return window.localStorage;
    }

    getFromLocalStorage () {
        let localStorage = this.getWindowLocalStorage();
        if ( Application.STORAGE_KEY in localStorage ) {
            return JSON.parse(localStorage[Application.STORAGE_KEY]);
        }
        return [];
    }

    saveToLocalStorage (word) {
        let blockedWords = null;

        if ( "string" == typeof word ) {
            blockedWords = this.getFromLocalStorage();
            /*if ( word in blockedWords ) {
             alert('Already stored');
             return;
             }*/
            blockedWords.push(word);
        } else {
            blockedWords = word;
        }

        this.setState({
            words: blockedWords
        });

        this.getWindowLocalStorage()[Application.STORAGE_KEY] = JSON.stringify(blockedWords);
    }

    handleFormSubmit () {
        let word = this.refs.word.value.trim().toLowerCase();
        if ( !word ) {
            alert('Add some word');
            return;
        }
        this.saveToLocalStorage(word);

        // clear input field
        this.refs.word.value = "";
    }

    handleKeyPress (target) {
        if ( target.charCode == 13 ) {
            this.handleFormSubmit();
            return;
        }
    }

    updateBlockedWord (target) {
        if ( target.charCode != 13 ) {
            return;
        }
        console.log(target.id);
    }

    handleDelete (e) {
        let id = e.target.id;
        let [index, word] = this.detachButtonId(id);
        let localStorage = this.getFromLocalStorage();
        localStorage.splice(index, 1);
        this.saveToLocalStorage(localStorage);
    }

    inputIdBuilder (index, word) {
        return JSON.stringify([
            'input',
            index,
            word
        ]);
    }

    detachInputId (id) {
        return JSON.parse(id);
    }

    detachButtonId (id) {
        return JSON.parse(id);
    }

    buttonIdBuilder (index, word) {
        return JSON.stringify([
            index,
            word
        ]);
    }

    render () {
        return (
            <div className = "container-fluid">
                <table className = "table table-responsive">
                    <tbody>
                    <tr>
                        <td>
                            <input type = 'text' ref = {"word"} onKeyPress = {this.handleKeyPress.bind(this)} className = 'form-control' />
                        </td>
                        <td>
                            <button type = 'button' className = 'btn btn-success btn-sm' onClick = {this.handleFormSubmit.bind(this)}>
                                Save
                            </button>
                        </td>
                    </tr>
                    {
                        Object.keys(this.state.words).map((index) => {
                            return <tr key = {"key-" + this.buttonIdBuilder(index, this.state.words[index])}>
                                <td>
                                    <input type = 'text' ref = {this.inputIdBuilder(index, this.state.words[index])} onKeyPress = {this.updateBlockedWord.bind(this)} defaultValue = {this.state.words[index]} className = 'form-control' />
                                </td>
                                <td>
                                    <button type = 'button' id = {this.buttonIdBuilder(index, this.state.words[index])} className = 'btn btn-warning btn-sm' onClick = {this.handleDelete.bind(this)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>;
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Application;