import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader} from './views/base';

/**Global state of the app
 * - search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes 
 */
const state = {};

/**
 * Search Controller
 */
const controlSearch = async () => {
    // 1. Get query from the view
    //const query = searchView.getInput();
    const query = 'pizza';
    

    if(query) {
        //2. New search object add to state
        state.search = new Search(query);

        //3 Prepare the UI for results
            searchView.clearInput();
            searchView.clearResults();
            renderLoader(elements.searchRes);

            try {

        //4.Search for recipes
        await state.search.getResults();

        //5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        } catch(err) {
            alert('Something went wrong with the search...');
            clearLoader();
        } 
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();

});
// TESTING
window.addEventListener('load', e => {
    e.preventDefault();
    controlSearch();

});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    console.log(btn);
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        
    }
});

/**
 * Recipe Controller
 */
const controlRecipe = async () => {
    // get id from URL
    const id = window.location.hash.replace('#', '' );
    console.log(id);

    if(id) {
        // Prepare UI for changes

        //Create new Recipe object
        state.recipe = new Recipe(id);
        try {

        //Get Recipe data
        await state.recipe.getRecipe(); 

        //Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings(); 

        //Render recipe
        console.log(state.recipe);
        } catch(err) {
            alert('Error Processing Recipe');
        }
    }


};


 ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));