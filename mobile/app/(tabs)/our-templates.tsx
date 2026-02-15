import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, X, Eye, DollarSign } from 'lucide-react-native';
import TopBar from '@/components/TopBar';
import { getAllProjects, Project } from '../../services/projectsService';

export default function OurTemplatesScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProjects = async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await getAllProjects();

      if (fetchError) {
        setError(fetchError);
      } else if (data) {
        setProjects(data);
        setFilteredProjects(data);
      }
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.tags?.some(tag => tag.toLowerCase().includes(query))
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProjects();
  }, []);

  const handleProjectPress = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const formatPrice = (price: number) => {
    return price?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) || '0.00';
  };

  return (
    <SafeAreaView className="flex-1 bg-beige">
      <TopBar />
      <ScrollView
        className="flex-1 px-6 pt-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Text
          className="text-primary text-2xl font-bold mb-2"
          style={{ fontFamily: 'SpaceGrotesk-Bold' }}
        >
          Our Templates
        </Text>
        <Text
          className="text-primary/70 text-sm leading-6 mb-5"
          style={{ fontFamily: 'Manrope-Regular' }}
        >
          Explore ready-made 3D project designs with detailed pricing and materials.
        </Text>

        {/* Search Bar */}
        <View className="bg-white rounded-2xl flex-row items-center px-4 mb-6 border border-primary/10">
          <Search size={20} color="#022d37" strokeWidth={2} />
          <TextInput
            className="flex-1 py-3 px-3 text-primary"
            style={{ fontFamily: 'Manrope-Regular' }}
            placeholder="Search projects..."
            placeholderTextColor="rgba(2, 45, 55, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="p-1">
              <X size={18} color="#022d37" />
            </TouchableOpacity>
          )}
        </View>

        {/* Loading State */}
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#022d37" />
            <Text
              className="text-primary/60 mt-4"
              style={{ fontFamily: 'Manrope-Regular' }}
            >
              Loading projects...
            </Text>
          </View>
        ) : error ? (
          /* Error State */
          <View className="flex-1 items-center justify-center py-20">
            <Text
              className="text-red-600 text-center mb-4"
              style={{ fontFamily: 'Manrope-Regular' }}
            >
              {error}
            </Text>
            <TouchableOpacity
              className="bg-primary px-6 py-3 rounded-xl"
              onPress={fetchProjects}
            >
              <Text
                className="text-beige font-semibold"
                style={{ fontFamily: 'Manrope-SemiBold' }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredProjects.length === 0 ? (
          /* Empty State */
          <View className="flex-1 items-center justify-center py-20">
            <Text
              className="text-primary/60 text-center"
              style={{ fontFamily: 'Manrope-Regular' }}
            >
              {searchQuery ? 'No projects match your search' : 'No projects available yet'}
            </Text>
          </View>
        ) : (
          /* Projects Grid */
          <View className="gap-4 pb-10">
            {filteredProjects.map((project) => (
              <TouchableOpacity
                key={project._id}
                onPress={() => handleProjectPress(project._id)}
                activeOpacity={0.95}
                className="bg-white rounded-3xl overflow-hidden border border-primary/10"
                style={{
                  shadowColor: '#022d37',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                {/* Project Image */}
                <View className="h-44 bg-primary/10">
                  {project.screenshot ? (
                    <Image
                      source={{ uri: project.screenshot }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center">
                      <Text className="text-primary/40 text-4xl">🏠</Text>
                    </View>
                  )}

                  {/* Status Badge */}
                  <View className="absolute top-3 right-3 bg-primary/80 px-3 py-1 rounded-full">
                    <Text
                      className="text-beige text-xs font-semibold capitalize"
                      style={{ fontFamily: 'Manrope-SemiBold' }}
                    >
                      {project.status?.replace('_', ' ') || 'Draft'}
                    </Text>
                  </View>
                </View>

                {/* Project Info */}
                <View className="p-4">
                  <Text
                    className="text-primary text-lg font-bold mb-1"
                    style={{ fontFamily: 'Manrope-SemiBold' }}
                    numberOfLines={1}
                  >
                    {project.name}
                  </Text>

                  {project.description && (
                    <Text
                      className="text-primary/60 text-sm mb-3"
                      style={{ fontFamily: 'Manrope-Regular' }}
                      numberOfLines={2}
                    >
                      {project.description}
                    </Text>
                  )}

                  {/* Dimensions */}
                  <View className="flex-row items-center mb-3">
                    <View className="bg-beige/80 px-2 py-1 rounded-lg mr-2">
                      <Text
                        className="text-primary/70 text-xs"
                        style={{ fontFamily: 'Manrope-Medium' }}
                      >
                        {project.dimensions?.width || 0} × {project.dimensions?.length || 0} × {project.dimensions?.height || 0}m
                      </Text>
                    </View>
                    {project.calculatedAreas?.totalArea > 0 && (
                      <View className="bg-accent/10 px-2 py-1 rounded-lg">
                        <Text
                          className="text-accent text-xs"
                          style={{ fontFamily: 'Manrope-Medium' }}
                        >
                          {project.calculatedAreas.totalArea.toFixed(1)} m²
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Footer: Price and Views */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <DollarSign size={18} color="#084C5C" />
                      <Text
                        className="text-accent text-lg font-bold ml-1"
                        style={{ fontFamily: 'JetBrainsMono-Medium' }}
                      >
                        {formatPrice(project.pricing?.totalPrice)}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Eye size={14} color="rgba(2, 45, 55, 0.5)" />
                      <Text
                        className="text-primary/50 text-xs ml-1"
                        style={{ fontFamily: 'Manrope-Regular' }}
                      >
                        {project.views || 0} views
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
