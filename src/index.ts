import axios from "axios";
import fetchAdapter from "./adapter";

axios.defaults.adapter = fetchAdapter;

const myCss = GM_getResourceText("JQUERY_UI");
console.log(myCss);
GM_addStyle(myCss);

$("head").append(
  `<link rel="stylesheet" href="https://erisberg.github.io/tm_smext/public/style.css" type="text/css" />`
);

const ITEM_NAME_ID = "largeiteminfo_item_name";
const BUYORDER_INPUT_ID = "market_buyorder_dialog_paymentinfo";

const ID_PREFIX = "sms";

type ItemDetails = {
  itemName: string;
};

export type MenuState = {
  isOpen: boolean;
};

const itemDetails: ItemDetails = { itemName: "" };
const customerDetails = {};

const getID = (id: string) => `${ID_PREFIX}_${id}`;

document.addEventListener("menuToggle", (e: CustomEvent<MenuState>) => {
  const icon = $("#" + getID("btnToggleIcon"));

  $(icon).css({
    transform: `rotate(${e.detail.isOpen ? "90" : "0"}deg)`,
  });
});

function main() {
  getItemDetails();
  getCustomerDetails();
  createMenu();
}

function getItemDetails() {
  itemDetails.itemName = $(`#${ITEM_NAME_ID}`).text();
}

function getCustomerDetails() {
  $(`#${BUYORDER_INPUT_ID}`)
    .find("input")
    .map(function () {
      const name = $(this).attr("name");
      if (name !== undefined) (customerDetails as any)[name] = this.value;
    });

  // customerDetails.wallet_currency = window.g_rgWalletInfo.wallet_currency;
}

function createMenu() {
  $("body").append(`
        <div class="sms_wrapper" id="${getID("wrapper")}">
            <button class="sms_btn" id="${getID("btnToggle")}">
                <span class="sms_btnToggleIcon" id="${getID(
                  "btnToggleIcon"
                )}">&#10095;</span> Menu
            </button>
            <div id="${getID("menu")}">
                <p>Hello world</p>
            </div>
        </div>
    `);

  const menu = $("#" + getID("menu"));
  const isOpen = menu.css("display") !== "none";

  $("#" + getID("btnToggleIcon")).css({
    transform: `rotate(${isOpen ? "90" : "0"}deg)`,
  });

  $("#" + getID("btnToggle")).on("click", () => {
    menu.toggle();

    const event = new CustomEvent<MenuState>("menuToggle", {
      detail: {
        isOpen: isOpen,
      },
    });

    dispatchEvent(event);
  });
}

main();
