import { getPosts } from '../api/posts';
import { useFetch } from './useFetch';

export function usePosts() {
  return useFetch(getPosts, []);
}
