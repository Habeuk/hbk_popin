/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/popin.js":
/*!*************************!*\
  !*** ./src/js/popin.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const KEY = "hbk_popin__";
class Popin {
  constructor(context) {
    //
    this.timerScroll;
    this.timerResize;
    this.context = context;
    this.selector = ".hbk_popin_block";
    this.PoPins = [];
  }

  /**
   * --
   * @returns
   */
  generateIconClose() {
    const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    //
    iconSvg.setAttribute("viewBox", "0 0 14 14");
    iconSvg.setAttribute("height", "14px");
    iconSvg.setAttribute("width", "14px");
    iconSvg.setAttribute("focusable", false);
    iconSvg.classList.add("svg-close");
    iconSvg.classList.add("js-close");
    //
    iconPath.setAttribute("d", "M13 13L1 1M13 1L1 13");
    iconPath.setAttribute("stroke", "currentColor");
    iconPath.setAttribute("stroke-width", "1.1");
    iconPath.setAttribute("fill", "none");
    iconSvg.appendChild(iconPath);
    return iconSvg;
  }

  /**
   * Ajoute l'icone de fermeture.
   */
  addIconClose(PoPin, idPopin = false, config = {}) {
    //hidden;
    const actionclose = PoPin => {
      PoPin.classList.remove("open");
      document.querySelector("body").classList.remove("modal-open");
      if (idPopin) this.setStatusToCache(idPopin, config);
      setTimeout(() => {
        PoPin.classList.add("hidden");
      }, 3000);
    };
    // add cover
    const covertDk = document.createElement("div");
    covertDk.setAttribute("class", "overlay");
    PoPin.appendChild(covertDk);
    PoPin.querySelector(".overlay").addEventListener("click", () => {
      // actionclose(PoPin);
    });
    // add button close.
    PoPin.querySelector(".hbk_popin_block__container .hbk_content").appendChild(this.generateIconClose());
    PoPin.querySelector(".js-close").addEventListener("click", () => {
      actionclose(PoPin);
    });
    // close with click on link.
    const link = PoPin.querySelector(".hbk_popin_block__link");
    if (link) link.addEventListener("click", event => {
      const listener = event.target;
      if (!listener.classList.contains("close")) {
        event.preventDefault();
        listener.classList.add("close");
        actionclose(PoPin);
        setTimeout(() => {
          listener.click();
        }, 100);
      }
    });
  }
  getCache(config) {
    if (config.type_affichage == "by_session") {
      return window.sessionStorage;
    }
    if (config.type_affichage == "by_user") {
      return window.localStorage;
    }
  }
  setStatusToCache(idPopin, config) {
    const cache = this.getCache(config);
    cache.setItem(KEY + idPopin, JSON.stringify({
      user_close: true
    }));
  }
  getStatusFromCache(idPopin, config) {
    const cache = this.getCache(config);
    const value = cache.getItem(KEY + idPopin);
    if (!value) {
      return {
        user_close: false
      };
    } else {
      return JSON.parse(value);
    }
  }
  openModal() {
    let addClassBody = false;
    this.PoPins.forEach(PoPin => {
      const config = JSON.parse(PoPin.getAttribute("data-config"));
      const idPopin = PoPin.getAttribute("data-popin_id");
      const configCache = this.getStatusFromCache(idPopin, config);
      if (config && config.status && !configCache.user_close) {
        const delai = parseInt(config.delais);
        setTimeout(() => {
          PoPin.classList.add("open");
          this.addIconClose(PoPin, idPopin, config);
          if (!addClassBody) document.querySelector("body").classList.add("modal-open");
        }, delai * 1000);
      } else {
        PoPin.classList.add("hidden");
      }
    });
  }
  togglePopin(id) {
    const PoPin = this.context.getElementById(id);
    let addClassBody = false;
    if (PoPin) {
      PoPin.classList.remove("hidden");
      PoPin.classList.add("open");
      this.addIconClose(PoPin);
      if (!addClassBody) document.querySelector("body").classList.add("modal-open");
    }
  }

  /**
   * Initialisation
   */
  build() {
    window.addEventListener("load", () => {
      this.PoPins = this.context.querySelectorAll(this.selector);
      this.openModal();
    });
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Popin);

/***/ }),

/***/ "./src/scss/popin.scss":
/*!*****************************!*\
  !*** ./src/scss/popin.scss ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************************!*\
  !*** ./src/js/popin-drupal.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_popin_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/popin.scss */ "./src/scss/popin.scss");
/* harmony import */ var _popin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./popin */ "./src/js/popin.js");


(function (Drupal) {
  Drupal.behaviors.myModuleBehavior = {
    attach: function (context, settings) {
      if (once("hbkPopin", ".hbk_popin_block", context).length > 0) {
        const HBK = new _popin__WEBPACK_IMPORTED_MODULE_1__["default"](context);
        HBK.build();
      }
    }
  };
  //
})(Drupal);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTjRCO0FBRUE7QUFDNUIsQ0FBQyxVQUFVZ0UsTUFBTSxFQUFFO0VBQ2pCQSxNQUFNLENBQUNDLFNBQVMsQ0FBQ0MsZ0JBQWdCLEdBQUc7SUFDbENDLE1BQU0sRUFBRSxTQUFBQSxDQUFVakUsT0FBTyxFQUFFa0UsUUFBUSxFQUFFO01BQ25DLElBQUlDLElBQUksQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLEVBQUVuRSxPQUFPLENBQUMsQ0FBQ29FLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDNUQsTUFBTUMsR0FBRyxHQUFHLElBQUlSLDhDQUFLLENBQUM3RCxPQUFPLENBQUM7UUFDOUJxRSxHQUFHLENBQUNWLEtBQUssQ0FBQyxDQUFDO01BQ2I7SUFDRjtFQUNGLENBQUM7RUFDRDtBQUNGLENBQUMsRUFBRUcsTUFBTSxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac3RlcGhhbmU4ODgvd2J1LWF0b21pcXVlLXRoZW1lLy4vc3JjL2pzL3BvcGluLmpzIiwid2VicGFjazovL0BzdGVwaGFuZTg4OC93YnUtYXRvbWlxdWUtdGhlbWUvLi9zcmMvc2Nzcy9wb3Bpbi5zY3NzP2ViNWMiLCJ3ZWJwYWNrOi8vQHN0ZXBoYW5lODg4L3didS1hdG9taXF1ZS10aGVtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Ac3RlcGhhbmU4ODgvd2J1LWF0b21pcXVlLXRoZW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9Ac3RlcGhhbmU4ODgvd2J1LWF0b21pcXVlLXRoZW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQHN0ZXBoYW5lODg4L3didS1hdG9taXF1ZS10aGVtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0BzdGVwaGFuZTg4OC93YnUtYXRvbWlxdWUtdGhlbWUvLi9zcmMvanMvcG9waW4tZHJ1cGFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEtFWSA9IFwiaGJrX3BvcGluX19cIjtcbmNsYXNzIFBvcGluIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCkge1xuICAgIC8vXG4gICAgdGhpcy50aW1lclNjcm9sbDtcbiAgICB0aGlzLnRpbWVyUmVzaXplO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5zZWxlY3RvciA9IFwiLmhia19wb3Bpbl9ibG9ja1wiO1xuICAgIHRoaXMuUG9QaW5zID0gW107XG4gIH1cblxuICAvKipcbiAgICogLS1cbiAgICogQHJldHVybnNcbiAgICovXG4gIGdlbmVyYXRlSWNvbkNsb3NlKCkge1xuICAgIGNvbnN0IGljb25TdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInN2Z1wiKTtcbiAgICBjb25zdCBpY29uUGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwicGF0aFwiKTtcbiAgICAvL1xuICAgIGljb25Tdmcuc2V0QXR0cmlidXRlKFwidmlld0JveFwiLCBcIjAgMCAxNCAxNFwiKTtcbiAgICBpY29uU3ZnLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBcIjE0cHhcIik7XG4gICAgaWNvblN2Zy5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBcIjE0cHhcIik7XG4gICAgaWNvblN2Zy5zZXRBdHRyaWJ1dGUoXCJmb2N1c2FibGVcIiwgZmFsc2UpO1xuICAgIGljb25TdmcuY2xhc3NMaXN0LmFkZChcInN2Zy1jbG9zZVwiKTtcbiAgICBpY29uU3ZnLmNsYXNzTGlzdC5hZGQoXCJqcy1jbG9zZVwiKTtcbiAgICAvL1xuICAgIGljb25QYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJNMTMgMTNMMSAxTTEzIDFMMSAxM1wiKTtcbiAgICBpY29uUGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCJjdXJyZW50Q29sb3JcIik7XG4gICAgaWNvblBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIFwiMS4xXCIpO1xuICAgIGljb25QYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgIGljb25TdmcuYXBwZW5kQ2hpbGQoaWNvblBhdGgpO1xuICAgIHJldHVybiBpY29uU3ZnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFqb3V0ZSBsJ2ljb25lIGRlIGZlcm1ldHVyZS5cbiAgICovXG4gIGFkZEljb25DbG9zZShQb1BpbiwgaWRQb3BpbiA9IGZhbHNlLCBjb25maWcgPSB7fSkge1xuICAgIC8vaGlkZGVuO1xuICAgIGNvbnN0IGFjdGlvbmNsb3NlID0gKFBvUGluKSA9PiB7XG4gICAgICBQb1Bpbi5jbGFzc0xpc3QucmVtb3ZlKFwib3BlblwiKTtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJtb2RhbC1vcGVuXCIpO1xuICAgICAgaWYgKGlkUG9waW4pIHRoaXMuc2V0U3RhdHVzVG9DYWNoZShpZFBvcGluLCBjb25maWcpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIFBvUGluLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICB9LCAzMDAwKTtcbiAgICB9O1xuICAgIC8vIGFkZCBjb3ZlclxuICAgIGNvbnN0IGNvdmVydERrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb3ZlcnREay5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm92ZXJsYXlcIik7XG4gICAgUG9QaW4uYXBwZW5kQ2hpbGQoY292ZXJ0RGspO1xuICAgIFBvUGluLnF1ZXJ5U2VsZWN0b3IoXCIub3ZlcmxheVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgLy8gYWN0aW9uY2xvc2UoUG9QaW4pO1xuICAgIH0pO1xuICAgIC8vIGFkZCBidXR0b24gY2xvc2UuXG4gICAgUG9QaW4ucXVlcnlTZWxlY3RvcihcIi5oYmtfcG9waW5fYmxvY2tfX2NvbnRhaW5lciAuaGJrX2NvbnRlbnRcIikuYXBwZW5kQ2hpbGQodGhpcy5nZW5lcmF0ZUljb25DbG9zZSgpKTtcbiAgICBQb1Bpbi5xdWVyeVNlbGVjdG9yKFwiLmpzLWNsb3NlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBhY3Rpb25jbG9zZShQb1Bpbik7XG4gICAgfSk7XG4gICAgLy8gY2xvc2Ugd2l0aCBjbGljayBvbiBsaW5rLlxuICAgIGNvbnN0IGxpbmsgPSBQb1Bpbi5xdWVyeVNlbGVjdG9yKFwiLmhia19wb3Bpbl9ibG9ja19fbGlua1wiKTtcbiAgICBpZiAobGluaylcbiAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgaWYgKCFsaXN0ZW5lci5jbGFzc0xpc3QuY29udGFpbnMoXCJjbG9zZVwiKSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgbGlzdGVuZXIuY2xhc3NMaXN0LmFkZChcImNsb3NlXCIpO1xuICAgICAgICAgIGFjdGlvbmNsb3NlKFBvUGluKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGxpc3RlbmVyLmNsaWNrKCk7XG4gICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbiAgZ2V0Q2FjaGUoY29uZmlnKSB7XG4gICAgaWYgKGNvbmZpZy50eXBlX2FmZmljaGFnZSA9PSBcImJ5X3Nlc3Npb25cIikge1xuICAgICAgcmV0dXJuIHdpbmRvdy5zZXNzaW9uU3RvcmFnZTtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy50eXBlX2FmZmljaGFnZSA9PSBcImJ5X3VzZXJcIikge1xuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gICAgfVxuICB9XG4gIHNldFN0YXR1c1RvQ2FjaGUoaWRQb3BpbiwgY29uZmlnKSB7XG4gICAgY29uc3QgY2FjaGUgPSB0aGlzLmdldENhY2hlKGNvbmZpZyk7XG4gICAgY2FjaGUuc2V0SXRlbShLRVkgKyBpZFBvcGluLCBKU09OLnN0cmluZ2lmeSh7IHVzZXJfY2xvc2U6IHRydWUgfSkpO1xuICB9XG4gIGdldFN0YXR1c0Zyb21DYWNoZShpZFBvcGluLCBjb25maWcpIHtcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMuZ2V0Q2FjaGUoY29uZmlnKTtcbiAgICBjb25zdCB2YWx1ZSA9IGNhY2hlLmdldEl0ZW0oS0VZICsgaWRQb3Bpbik7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXNlcl9jbG9zZTogZmFsc2UsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgb3Blbk1vZGFsKCkge1xuICAgIGxldCBhZGRDbGFzc0JvZHkgPSBmYWxzZTtcbiAgICB0aGlzLlBvUGlucy5mb3JFYWNoKChQb1BpbikgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gSlNPTi5wYXJzZShQb1Bpbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbmZpZ1wiKSk7XG4gICAgICBjb25zdCBpZFBvcGluID0gUG9QaW4uZ2V0QXR0cmlidXRlKFwiZGF0YS1wb3Bpbl9pZFwiKTtcbiAgICAgIGNvbnN0IGNvbmZpZ0NhY2hlID0gdGhpcy5nZXRTdGF0dXNGcm9tQ2FjaGUoaWRQb3BpbiwgY29uZmlnKTtcbiAgICAgIGlmIChjb25maWcgJiYgY29uZmlnLnN0YXR1cyAmJiAhY29uZmlnQ2FjaGUudXNlcl9jbG9zZSkge1xuICAgICAgICBjb25zdCBkZWxhaSA9IHBhcnNlSW50KGNvbmZpZy5kZWxhaXMpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBQb1Bpbi5jbGFzc0xpc3QuYWRkKFwib3BlblwiKTtcbiAgICAgICAgICB0aGlzLmFkZEljb25DbG9zZShQb1BpbiwgaWRQb3BpbiwgY29uZmlnKTtcbiAgICAgICAgICBpZiAoIWFkZENsYXNzQm9keSkgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuY2xhc3NMaXN0LmFkZChcIm1vZGFsLW9wZW5cIik7XG4gICAgICAgIH0sIGRlbGFpICogMTAwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBQb1Bpbi5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdG9nZ2xlUG9waW4oaWQpIHtcbiAgICBjb25zdCBQb1BpbiA9IHRoaXMuY29udGV4dC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgbGV0IGFkZENsYXNzQm9keSA9IGZhbHNlO1xuICAgIGlmIChQb1Bpbikge1xuICAgICAgUG9QaW4uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgIFBvUGluLmNsYXNzTGlzdC5hZGQoXCJvcGVuXCIpO1xuICAgICAgdGhpcy5hZGRJY29uQ2xvc2UoUG9QaW4pO1xuICAgICAgaWYgKCFhZGRDbGFzc0JvZHkpIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmNsYXNzTGlzdC5hZGQoXCJtb2RhbC1vcGVuXCIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXNhdGlvblxuICAgKi9cbiAgYnVpbGQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICAgIHRoaXMuUG9QaW5zID0gdGhpcy5jb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZWxlY3Rvcik7XG4gICAgICB0aGlzLm9wZW5Nb2RhbCgpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBvcGluO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuLi9zY3NzL3BvcGluLnNjc3NcIjtcblxuaW1wb3J0IHBvcGluIGZyb20gXCIuL3BvcGluXCI7XG4oZnVuY3Rpb24gKERydXBhbCkge1xuICBEcnVwYWwuYmVoYXZpb3JzLm15TW9kdWxlQmVoYXZpb3IgPSB7XG4gICAgYXR0YWNoOiBmdW5jdGlvbiAoY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgIGlmIChvbmNlKFwiaGJrUG9waW5cIiwgXCIuaGJrX3BvcGluX2Jsb2NrXCIsIGNvbnRleHQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgSEJLID0gbmV3IHBvcGluKGNvbnRleHQpO1xuICAgICAgICBIQksuYnVpbGQoKTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xuICAvL1xufSkoRHJ1cGFsKTtcbiJdLCJuYW1lcyI6WyJLRVkiLCJQb3BpbiIsImNvbnN0cnVjdG9yIiwiY29udGV4dCIsInRpbWVyU2Nyb2xsIiwidGltZXJSZXNpemUiLCJzZWxlY3RvciIsIlBvUGlucyIsImdlbmVyYXRlSWNvbkNsb3NlIiwiaWNvblN2ZyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwiaWNvblBhdGgiLCJzZXRBdHRyaWJ1dGUiLCJjbGFzc0xpc3QiLCJhZGQiLCJhcHBlbmRDaGlsZCIsImFkZEljb25DbG9zZSIsIlBvUGluIiwiaWRQb3BpbiIsImNvbmZpZyIsImFjdGlvbmNsb3NlIiwicmVtb3ZlIiwicXVlcnlTZWxlY3RvciIsInNldFN0YXR1c1RvQ2FjaGUiLCJzZXRUaW1lb3V0IiwiY292ZXJ0RGsiLCJjcmVhdGVFbGVtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImxpbmsiLCJldmVudCIsImxpc3RlbmVyIiwidGFyZ2V0IiwiY29udGFpbnMiLCJwcmV2ZW50RGVmYXVsdCIsImNsaWNrIiwiZ2V0Q2FjaGUiLCJ0eXBlX2FmZmljaGFnZSIsIndpbmRvdyIsInNlc3Npb25TdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiY2FjaGUiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsInVzZXJfY2xvc2UiLCJnZXRTdGF0dXNGcm9tQ2FjaGUiLCJ2YWx1ZSIsImdldEl0ZW0iLCJwYXJzZSIsIm9wZW5Nb2RhbCIsImFkZENsYXNzQm9keSIsImZvckVhY2giLCJnZXRBdHRyaWJ1dGUiLCJjb25maWdDYWNoZSIsInN0YXR1cyIsImRlbGFpIiwicGFyc2VJbnQiLCJkZWxhaXMiLCJ0b2dnbGVQb3BpbiIsImlkIiwiZ2V0RWxlbWVudEJ5SWQiLCJidWlsZCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwb3BpbiIsIkRydXBhbCIsImJlaGF2aW9ycyIsIm15TW9kdWxlQmVoYXZpb3IiLCJhdHRhY2giLCJzZXR0aW5ncyIsIm9uY2UiLCJsZW5ndGgiLCJIQksiXSwic291cmNlUm9vdCI6IiJ9