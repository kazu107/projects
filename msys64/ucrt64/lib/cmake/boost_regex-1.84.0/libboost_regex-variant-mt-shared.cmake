# Generated by Boost 1.84.0

# address-model=64

if(CMAKE_SIZEOF_VOID_P EQUAL 4)
  _BOOST_SKIPPED("libboost_regex-mt.dll.a" "64 bit, need 32")
  return()
endif()

# layout=tagged

# toolset=mgw13

# link=shared

if(DEFINED Boost_USE_STATIC_LIBS)
  if(Boost_USE_STATIC_LIBS)
    _BOOST_SKIPPED("libboost_regex-mt.dll.a" "shared, Boost_USE_STATIC_LIBS=${Boost_USE_STATIC_LIBS}")
    return()
  endif()
else()
  if(MSVC AND NOT _BOOST_SINGLE_VARIANT)
    _BOOST_SKIPPED("libboost_regex-mt.dll.a" "shared, default on Windows/MSVC is static, set Boost_USE_STATIC_LIBS=OFF to override")
    return()
  endif()
endif()

# runtime-link=shared

if(Boost_USE_STATIC_RUNTIME)
  _BOOST_SKIPPED("libboost_regex-mt.dll.a" "shared runtime, Boost_USE_STATIC_RUNTIME=${Boost_USE_STATIC_RUNTIME}")
  return()
endif()

# runtime-debugging=off

if(Boost_USE_DEBUG_RUNTIME)
  _BOOST_SKIPPED("libboost_regex-mt.dll.a" "release runtime, Boost_USE_DEBUG_RUNTIME=${Boost_USE_DEBUG_RUNTIME}")
  return()
endif()

# threading=multi

if(DEFINED Boost_USE_MULTITHREADED AND NOT Boost_USE_MULTITHREADED)
  _BOOST_SKIPPED("libboost_regex-mt.dll.a" "multithreaded, Boost_USE_MULTITHREADED=${Boost_USE_MULTITHREADED}")
  return()
endif()

# variant=release

if(NOT "${Boost_USE_RELEASE_LIBS}" STREQUAL "" AND NOT Boost_USE_RELEASE_LIBS)
  _BOOST_SKIPPED("libboost_regex-mt.dll.a" "release, Boost_USE_RELEASE_LIBS=${Boost_USE_RELEASE_LIBS}")
  return()
endif()

if(Boost_VERBOSE OR Boost_DEBUG)
  message(STATUS "  [x] libboost_regex-mt.dll.a")
endif()

# Create imported target Boost::regex

if(NOT TARGET Boost::regex)
  add_library(Boost::regex SHARED IMPORTED)

  set_target_properties(Boost::regex PROPERTIES
    INTERFACE_INCLUDE_DIRECTORIES "${_BOOST_INCLUDEDIR}"
    INTERFACE_COMPILE_DEFINITIONS "BOOST_REGEX_NO_LIB"
  )
endif()

# Target file name: libboost_regex-mt.dll.a

get_target_property(__boost_imploc Boost::regex IMPORTED_IMPLIB_RELEASE)
if(__boost_imploc)
  message(SEND_ERROR "Target Boost::regex already has an imported location '${__boost_imploc}', which is being overwritten with '${_BOOST_LIBDIR}/libboost_regex-mt.dll.a'")
endif()
unset(__boost_imploc)

set_property(TARGET Boost::regex APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)

set_target_properties(Boost::regex PROPERTIES
  IMPORTED_LINK_INTERFACE_LANGUAGES_RELEASE CXX
  IMPORTED_IMPLIB_RELEASE "${_BOOST_LIBDIR}/libboost_regex-mt.dll.a"
  )

set_target_properties(Boost::regex PROPERTIES
  IMPORTED_LOCATION_RELEASE "${_BOOST_LIBDIR}/libboost_regex-mt.dll"
  )

set_target_properties(Boost::regex PROPERTIES
  MAP_IMPORTED_CONFIG_MINSIZEREL Release
  MAP_IMPORTED_CONFIG_RELWITHDEBINFO Release
  )

set_property(TARGET Boost::regex APPEND
  PROPERTY INTERFACE_COMPILE_DEFINITIONS "BOOST_REGEX_DYN_LINK"
  )

list(APPEND _BOOST_REGEX_DEPS headers)
