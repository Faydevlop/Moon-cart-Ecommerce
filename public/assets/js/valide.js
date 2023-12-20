const categoryNameInput = document.getElementById('categoryName');
  const categoryNameErrorSpan = document.getElementById('categoryNameError');

  const descriptionInput = document.getElementById('description');
  const descriptionErrorSpan = document.getElementById('descriptionError');

  const categoryOffersInput = document.getElementById('categoryOffers');
  const categoryOffersErrorSpan = document.getElementById('categoryOffersError');

  const validateForm = () => {
    const isValidCategoryName = validateCategoryName();
    const isValidDescription = validateDescription();
    

    if (isValidCategoryName && isValidDescription ) {
      document.getElementById('category-form').submit();
    }
  };

  const validateCategoryName = () => {
    const categoryName = categoryNameInput.value.trim();
    const regex = /^[A-Z0-9 ]+$/;

    if (!categoryName) {
      categoryNameErrorSpan.textContent = 'Please enter a category name';
      categoryNameErrorSpan.style.display = 'block';
      categoryNameInput.focus();
      return false;
    } else if (!regex.test(categoryName)) {
      categoryNameErrorSpan.textContent = 'Category name must not contain special characters and only Capital letters ';
      categoryNameErrorSpan.style.display = 'block';
      categoryNameInput.focus();
      return false;
    } else {
      categoryNameErrorSpan.textContent = '';
      categoryNameErrorSpan.style.display = 'none';
      return true;
    }
  };

  const validateDescription = () => {
    const description = descriptionInput.value.trim();

    if (!description) {
      descriptionErrorSpan.textContent = 'Please enter a description for the category';
      descriptionErrorSpan.style.display = 'block';
      descriptionInput.focus();
      return false;
    } else {
      descriptionErrorSpan.textContent = '';
      descriptionErrorSpan.style.display = 'none';
      return true;
    }
  };

  // const validateCategoryOffers = () => {
  //   const categoryOffers = categoryOffersInput.value.trim();

  //   if (!categoryOffers) {
  //     categoryOffersErrorSpan.textContent = 'Please enter a value for category offers';
  //     categoryOffersErrorSpan.style.display = 'block';
  //     categoryOffersInput.focus();
  //     return false;
  //   } else if (isNaN(categoryOffers)) {
  //     categoryOffersErrorSpan.textContent = 'Category offers must be a valid number';
  //     categoryOffersErrorSpan.style.display = 'block';
  //     categoryOffersInput.focus();
  //     return false;
  //   }else if (categoryOffers >= 100 || categoryOffers <= 0 ) {
  //     categoryOffersErrorSpan.textContent = 'Category offers must be under 0% to 100%';
  //     categoryOffersErrorSpan.style.display = 'block';
  //     categoryOffersInput.focus();
  //     return false;
  //   }{
  //     categoryOffersErrorSpan.textContent = '';
  //     categoryOffersErrorSpan.style.display = 'none';
  //     return true;
  //   }
  // };
        