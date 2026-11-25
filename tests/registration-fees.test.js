const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const script = fs.readFileSync(path.join(__dirname, "..", "js", "main.js"), "utf8");

function registration(testDate = [2026, 10, 25, 12]) {
  class Field {
    constructor(value = "") {
      this.value = value;
      this.checked = false;
      this.disabled = false;
      this.listeners = {};
      this.parentElement = { style: {}, classList: { toggle() {} } };
    }

    addEventListener(type, listener) {
      (this.listeners[type] ||= []).push(listener);
    }

    dispatchEvent(event) {
      for (const listener of this.listeners[event.type] || []) listener.call(this, event);
    }

    setCustomValidity(message) {
      this.validationMessage = message;
    }
  }

  const fields = Object.fromEntries([
    "paymentMethod", "paymentSection", "chessLevel", "familyDiscount",
    "tshirtPurchase", "tshirtSize", "tshirtSizeGroup", "stepBookPurchaseYes",
    "stepBookPurchaseNo", "stepBookPurchaseGroup"
  ].map((id) => [id, new Field()]));
  fields.tshirtSize.querySelector = () => ({ value: "No T Shirt Needed (Opt Out)" });
  const student = new Field();
  const level = new Field();
  const books = [
    ["book-stepping-stones", "Stepping Stones"],
    ["book-step1", "Step 1"],
    ["book-step1-plus", "Step 1 - Plus"],
    ["book-step2", "Step 2"],
    ["book-step2-extra", "Step 2 - Extra"],
    ["book-coach-recommendation", "Contact Coach for Recommendation"]
  ].map(([id, value]) => {
    const book = new Field(value);
    fields[id] = book;
    return book;
  });
  let initialize;
  const document = {
    addEventListener(type, listener) {
      if (type === "DOMContentLoaded") initialize = listener;
    },
    getElementById(id) { return fields[id] || null; },
    querySelector(selector) {
      if (selector === 'select[name="entry.1900317233"]') return student;
      if (selector === 'select[name="entry.1459360062"]') return level;
      return null;
    },
    querySelectorAll(selector) {
      return selector === '#recommendedBooksGroup input[type="checkbox"]' ? books : [];
    }
  };
  class TestDate extends Date {
    constructor(...args) {
      super(...(args.length ? args : testDate));
    }
  }
  const window = { location: { search: "" }, addEventListener() {} };
  vm.runInNewContext(script, {
    document, window, Date: TestDate, URLSearchParams, console,
    localStorage: { getItem() { return null; } },
    Event: class { constructor(type) { this.type = type; } }
  });
  initialize();

  function change(field, value) {
    field.value = value;
    field.dispatchEvent({ type: "change" });
  }
  function check(field, checked) {
    field.checked = checked;
    field.dispatchEvent({ type: "change" });
  }
  return { fields, student, level, change, check, output: () => fields.paymentSection.innerHTML };
}

test("book prices update with student type, purchases and multiple selections", () => {
  const { fields, student, level, change, check, output } = registration();
  change(student, "New Student");
  change(fields.chessLevel, "Beginner");
  change(fields.familyDiscount, "Yes");
  change(fields.paymentMethod, "Venmo");
  change(level, "Stepping Stones");
  assert.match(output(), /Books: \$0\.00<br>Subtotal: \$100\.00/);
  check(fields["book-step1"], true);
  assert.match(output(), /Books: \$12\.99<br>Subtotal: \$112\.99/);
  change(student, "Returning Student");
  change(fields.tshirtPurchase, "Yes");
  assert.match(output(), /Books: \$25\.98<br>Subtotal: \$139\.48/);
  change(level, "Step 2");
  check(fields["book-step1-plus"], true);
  check(fields["book-step2-extra"], true);
  assert.match(output(), /Books: \$40\.97<br>Subtotal: \$154\.47/);
  check(fields.stepBookPurchaseNo, true);
  assert.match(output(), /Books: \$0\.00<br>Subtotal: \$113\.50/);
});

test("Square processing includes the book total and prompts for the payable amount", () => {
  const { fields, student, level, change, output } = registration();
  change(student, "New Student");
  change(fields.chessLevel, "Beginner");
  change(fields.familyDiscount, "Yes");
  change(level, "Step 1");
  change(fields.paymentMethod, "Credit/Debit Card(Square)");
  assert.match(output(), /Books: \$12\.99<br>Subtotal: \$112\.99/);
  assert.match(output(), /Total Amount Due: <strong>\$117\.16/);
  assert.match(output(), /Enter \$117\.16 on the Square payment page/);
});

test("Stepping Stones does not produce a total until student type is chosen", () => {
  const { fields, level, change, output } = registration();
  change(fields.chessLevel, "Beginner");
  change(level, "Stepping Stones");
  change(fields.paymentMethod, "Credit/Debit Card(Square)");
  assert.match(output(), /Select the student type to calculate the Stepping Stones price/);
  assert.doesNotMatch(output(), /Total Amount Due|btn-payment/);
});

test("regular class pricing includes returning-student Stepping Stones", () => {
  const { fields, student, level, change, output } = registration([2026, 11, 19, 12]);
  change(student, "Returning Student");
  change(fields.chessLevel, "Beginner");
  change(fields.familyDiscount, "No");
  change(level, "Stepping Stones");
  change(fields.paymentMethod, "Zelle");
  assert.match(output(), /Books: \$12\.99<br>Subtotal: \$137\.99/);
});
