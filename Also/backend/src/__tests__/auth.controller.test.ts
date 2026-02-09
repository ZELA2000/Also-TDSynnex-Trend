import * as authController from '../../controllers/auth.controller';
import AlsoApiClient from '../../client/AlsoApiClient';

// Mock the AlsoApiClient
jest.mock('../../client/AlsoApiClient');

describe('Auth Controller', () => {
    let mockRequest: any;
    let mockResponse: any;
    let mockNext: any;
    let mockApiClient: jest.Mocked<AlsoApiClient>;

    beforeEach(() => {
        mockRequest = {
            body: {},
            headers: {},
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();

        mockApiClient = new AlsoApiClient() as jest.Mocked<AlsoApiClient>;
        (AlsoApiClient as jest.Mock).mockImplementation(() => mockApiClient);
    });

    describe('login', () => {
        it('should return token on successful login', async () => {
            const mockToken = 'test-token-123';
            mockRequest.body = {
                UserName: 'testuser',
                Password: 'testpass',
            };

            mockApiClient.getSessionToken = jest.fn().mockResolvedValue(mockToken);

            await authController.login(mockRequest, mockResponse, mockNext);

            expect(mockApiClient.getSessionToken).toHaveBeenCalledWith({
                UserName: 'testuser',
                Password: 'testpass',
            });
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                token: mockToken,
                message: 'Authentication successful',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 if username is missing', async () => {
            mockRequest.body = {
                Password: 'testpass',
            };

            await authController.login(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Username and password are required',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next with error on API failure', async () => {
            const mockError = new Error('API Error');
            mockRequest.body = {
                UserName: 'testuser',
                Password: 'testpass',
            };

            mockApiClient.getSessionToken = jest.fn().mockRejectedValue(mockError);

            await authController.login(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe('validateSession', () => {
        it('should validate session successfully', async () => {
            mockRequest.headers.authorization = 'Bearer test-token';
            mockApiClient.setSessionToken = jest.fn();
            mockApiClient.validateSession = jest.fn().mockResolvedValue(undefined);

            await authController.validateSession(mockRequest, mockResponse, mockNext);

            expect(mockApiClient.setSessionToken).toHaveBeenCalledWith('test-token');
            expect(mockApiClient.validateSession).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: 'Session is valid',
            });
        });

        it('should return 401 if no token provided', async () => {
            mockRequest.headers = {};

            await authController.validateSession(mockRequest, mockResponse, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'No token provided',
            });
        });
    });

    describe('logout', () => {
        it('should logout successfully', async () => {
            mockRequest.headers.authorization = 'Bearer test-token';
            mockApiClient.setSessionToken = jest.fn();
            mockApiClient.terminateSession = jest.fn().mockResolvedValue(undefined);

            await authController.logout(mockRequest, mockResponse, mockNext);

            expect(mockApiClient.setSessionToken).toHaveBeenCalledWith('test-token');
            expect(mockApiClient.terminateSession).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: 'Logout successful',
            });
        });
    });
});
