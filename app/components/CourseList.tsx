"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Course {
  id: number;
  title: string;
  description: string;
  college_id: number;
  created_at: string;
  created_by: string;
}

interface CourseListProps {
  collegeId: number;
  refreshTrigger: number;
}

export default function CourseList({ collegeId, refreshTrigger }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('college_id', collegeId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [collegeId, refreshTrigger, supabase]); // Only fetch when collegeId changes or when refreshTrigger updates

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 rounded-xl bg-black/30 border border-zinc-800 animate-pulse">
            <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        <p>No courses available yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <div
          key={course.id}
          onClick={() => router.push(`/course/${course.id}`)}
          className="p-6 rounded-xl bg-black/30 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
        >
          <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors">
            {course.title}
          </h3>
          <p className="text-zinc-400 line-clamp-2 mb-2">{course.description}</p>
          <p className="text-sm text-zinc-500">
            Created {formatDistanceToNow(new Date(course.created_at), { addSuffix: true })}
          </p>
        </div>
      ))}
    </div>
  );
} 