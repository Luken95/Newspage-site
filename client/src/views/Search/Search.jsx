import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ArticleComp from '../../components/Article/ArticleComp'
import styles from './Search.module.css'

const { fetchArticlesBySearch } = require('../../dbUtils/articleActions')

export default function Search() {
  const { query } = useParams();
  const [searchResults, setsearchResults] = useState([])
  let articlesMapped = []

  useEffect(()=>{
    fetchArticlesBySearch({searchInput: query}).then(articles => { setsearchResults(articles)});
  }, [query]);

  articlesMapped = searchResults.map((searchResult, key) => {
    return <ArticleComp key={searchResult.id} article={searchResult} />
  })



  return (
    <div className={styles.search}>
      <h1>Search</h1>
      <h2>Searching for: {query}</h2>
      {articlesMapped}
    </div>
  )
}
