import { useEffect, useState } from 'react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        const result = await response.json();
        setUsers(result.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:3001/favorites/${userId}`);
        const result = await response.json();
        setFavorites(result.data || []);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };
    fetchFavorites();
  }, [userId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        if (debouncedSearch) {
          const recommendResponse = await fetch(
            `/api/jobs/recommendations`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ jobTitle: debouncedSearch }),
            }
          );
          const recommendResult = await recommendResponse.json();
          const jobIds = recommendResult.jobIds || [];
          
          if (jobIds.length === 0) {
            setJobs([]);
            setTotalPages(0);
          } else {
            const jobPromises = jobIds.map(id =>
              fetch(`/api/jobs/${id}`, {
                headers: { 'Content-Type': 'application/json' },
              })
                .then(res => res.json())
                .catch(err => {
                  console.error(`Error fetching job ${id}:`, err);
                  return null;
                })
            );
            const jobsData = await Promise.all(jobPromises);
            const validJobs = jobsData.filter(job => job != null);
            setJobs(validJobs);
            setTotalPages(0);
          }
        } else {
          const response = await fetch(
            `/api/jobs?page=${page}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const result = await response.json();
          setJobs(result.data || []);
          setTotalPages(result.pagination.lastPage || 0);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, debouncedSearch]);

  const toggleFavorite = async (jobId) => {
    const isFavorited = favorites.includes(jobId);
    try {
      if (isFavorited) {
        await fetch('http://localhost:3001/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, job_id: jobId }),
        });
        setFavorites(favorites.filter(id => id !== jobId));
      } else {
        await fetch('http://localhost:3001/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, job_id: jobId }),
        });
        setFavorites([...favorites, jobId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  const currentUser = users.find(u => u.id === userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-brand-base-80">Starred Job Opportunities</h1>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-brand-base-70">User:</label>
          <select
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            className="px-3 py-2 border border-brand-base-30 rounded-lg text-sm text-brand-base-80 focus:outline-none focus:border-brand-primary-50"
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <a 
        href="/ai-match" 
        className="block w-full px-6 py-3 bg-brand-primary-50 text-brand-primary-90 rounded-lg text-center font-medium hover:bg-brand-primary-60 transition-colors"
      >
        ✨ Try our newest feature: Let AI find the right job for you
      </a>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by job title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-brand-base-30 rounded-lg text-sm text-brand-base-80 placeholder:text-brand-base-60 focus:outline-none focus:border-brand-primary-50"
        />
        {searchQuery && (
          <p className="text-xs text-brand-base-60 mt-2">
            Searching across all jobs...
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job.id}
              className="border border-brand-base-30 rounded-lg p-4 hover:bg-brand-base-20 transition-colors relative"
            >
              <button
                onClick={() => toggleFavorite(job.id)}
                className="absolute top-4 right-4 text-2xl"
                title={favorites.includes(job.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                {favorites.includes(job.id) ? '❤️' : '🤍'}
              </button>
              <h2 className="text-lg font-medium text-brand-base-90 pr-10">{job.job_title}</h2>
              <p className="text-sm text-brand-base-60 mt-1">{job.company}</p>
              <p className="text-sm text-brand-base-70 mt-2">{job.description}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-brand-base-60">
            {searchQuery ? 'No jobs match your search' : 'No jobs found'}
          </div>
        )}
      </div>

      {!debouncedSearch && (
        <div className="flex justify-center items-center gap-4 py-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 border border-brand-base-30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-base-20"
          >
            Previous
          </button>
          <span className="text-sm text-brand-base-70">
            Page {page + 1} of {totalPages + 1}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border border-brand-base-30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-base-20"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;

