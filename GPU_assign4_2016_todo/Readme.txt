BUILDING THE PROJECT
====================

You need to install both the CUDA Toolkit 6.5 and CUDA Samples 6.5 (they are both in the same installation package) to build the executable.

I have included Visual Studio 2010 Solution/Project files to build the executables. The Visual Studio 2010 Solution/Project files can be converted by Visual Studio 2012 (and hopefully by Visual Studio 2013 too).

If you have installed your VS2010 or VS2012 AFTER you have installed CUDA Toolkit 6.5 and CUDA Samples 6.5, you have to do the following:


For VS2010 and VS2012
---------------------
(1) Go to CUDA Toolkit 6.5 folder "%CUDA_PATH%\extras\visual_studio_integration\MSBuildExtensions\".

(2) Copy all files from the folder to "C:\Program Files\MSBuild\Microsoft.Cpp\v4.0\BuildCustomizations\" or "C:\Program Files (x86)\MSBuild\Microsoft.Cpp\v4.0\BuildCustomizations\" folder.


--Kok-Lim
