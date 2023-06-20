import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { getImagesAPI } from '../service/api';
import { normalizeHits } from '../utils/normalizeHits';
import { Button } from '../Button/Button';
import { Wrapper, Error } from './App.styled';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from 'components/Searchbar/Searchbar';
import Loader from 'components/Loader/Loader';
import ImageGallery from 'components/ImageGallery/ImageGallery';

const imagesPerPage = 12;

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const abortCtrl = useRef();

  useEffect(() => {
    if (query === '') {
      return;
    }

    const getImages = async () => {
      if (abortCtrl.current) {
        abortCtrl.current.abort();
      }

      abortCtrl.current = new AbortController();

      try {
        setIsLoading(true);
        setError(null);

        const data = await getImagesAPI(
          query,
          currentPage,
          imagesPerPage,
          abortCtrl.current.signal
        );

        if (data.hits.length === 0) {
          return toast.info('Sorry, no images for your query...', {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (currentPage === 1) {
          toast.success('Wow! We found some images for you!', {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.success('Wow! We found some more images for you!', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }

        const normalizedHits = normalizeHits(data.hits);

        setImages(state => [...state, ...normalizedHits]);
        setIsLastPage(currentPage >= Math.ceil(data.totalHits / imagesPerPage));
        setError(null);
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    getImages();
  }, [currentPage, query]);

  const handleSearchSubmit = newQuery => {
    if (newQuery === query) {
      return;
    }

    setQuery(newQuery);
    setCurrentPage(1);
    setImages([]);
    setError(null);
    setIsLastPage(false);
  };

  const loadMore = () => {
    setCurrentPage(state => state + 1);
  };

  return (
    <Wrapper>
      <ToastContainer autoClose={2500} />
      <Searchbar onSubmit={handleSearchSubmit} />

      {error && <Error>Error: {error}</Error>}

      <ImageGallery images={images} />

      {isLoading && <Loader />}

      {!isLoading && images.length > 0 && !isLastPage && (
        <Button onClick={loadMore} />
      )}
    </Wrapper>
  );
};
